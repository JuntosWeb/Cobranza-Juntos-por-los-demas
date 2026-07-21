import { getPatientsWithPaymentStatus, getPatientsForSuspension, getServicePrices } from '@/lib/actions/patient.actions';
import { getSystemSettings } from '@/lib/actions/settings.actions';
import { PaymentStatusBadge } from '@/components/cobranza/PaymentStatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CobrarButton } from './CobrarButton';
import { ExtraChargeModal } from './ExtraChargeModal';
import { RevisarBajasButton } from './RevisarBajasButton';
import { EditPatientModal } from './EditPatientModal';
import { auth } from '@/auth';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CobranzaPage() {
  const session = await auth();
  const [patients, rawSuspendable, servicePrices, settings] = await Promise.all([
    getPatientsWithPaymentStatus(),
    getPatientsForSuspension(),
    getServicePrices(),
    getSystemSettings()
  ]);
  
  const groupedServices = servicePrices.reduce((acc: Record<string, typeof servicePrices[0][]>, curr: typeof servicePrices[0]) => {
    const sName = curr.service.name;
    if (!acc[sName]) acc[sName] = [];
    acc[sName].push(curr);
    return acc;
  }, {} as Record<string, typeof servicePrices>);
  
  const suspendablePatients = rawSuspendable.map((p: any) => ({
    id: p.id,
    folio: p.folio,
    fullName: p.fullName,
    lastPaymentDate: p.payments[0]?.paymentDate
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Control de Cobranza</h1>
        <RevisarBajasButton suspendablePatients={suspendablePatients} />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-x-auto">
        <Table className="min-w-[900px] whitespace-nowrap">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>Folio</TableHead>
              <TableHead>Nombre del Paciente</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Frecuencia / Horario</TableHead>
              <TableHead>Estado de Pago</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-slate-50/80 transition-colors duration-200">
                <TableCell className="font-semibold text-slate-700">{patient.folio || 'N/A'}</TableCell>
                <TableCell className="font-medium">{patient.fullName}</TableCell>
                <TableCell className="text-slate-600">{patient.serviceName}</TableCell>
                <TableCell className="text-slate-600">{patient.frequency}x - {patient.scheduleType}</TableCell>
                <TableCell>
                  <PaymentStatusBadge 
                    status={patient.status} 
                    hasPendingTransfer={patient.hasPendingTransfer}
                    hasLateFee={patient.hasLateFee}
                    isSuspended={patient.status === 'SUSPENDED'}
                  />
                </TableCell>
                <TableCell className="text-right flex items-center justify-end">
                  <CobrarButton 
                    patient={patient}
                    disabled={patient.status === 'SUSPENDED'}
                    recordedBy={session?.user?.email || 'Desconocido'}
                  />
                  <ExtraChargeModal patientId={patient.id} patientName={patient.fullName} />
                  <EditPatientModal patient={patient} groupedServices={groupedServices} patientCategories={settings?.patientCategories || ['PARTICULAR', 'FUNDACION']} />
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700">No hay pacientes</p>
                    <p className="text-sm text-slate-500">Comienza agregando un paciente nuevo al sistema.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
