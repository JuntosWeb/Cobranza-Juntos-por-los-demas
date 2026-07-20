import { getPatientsWithPaymentStatus, getPatientsForSuspension, getServicePrices } from '@/lib/actions/patient.actions';
import { PaymentStatusBadge } from '@/components/cobranza/PaymentStatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CobrarButton } from './CobrarButton';
import { RevisarBajasButton } from './RevisarBajasButton';
import { EditPatientModal } from './EditPatientModal';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function CobranzaPage() {
  const session = await auth();
  const patients = await getPatientsWithPaymentStatus();
  const rawSuspendable = await getPatientsForSuspension();
  const servicePrices = await getServicePrices();
  
  const groupedServices = servicePrices.reduce((acc, curr) => {
    const sName = curr.service.name;
    if (!acc[sName]) acc[sName] = [];
    acc[sName].push(curr);
    return acc;
  }, {} as Record<string, typeof servicePrices>);
  
  const suspendablePatients = rawSuspendable.map(p => ({
    id: p.id,
    folio: p.folio,
    fullName: p.fullName,
    lastPaymentDate: p.payments[0]?.paymentDate
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Control de Cobranza</h1>
        <RevisarBajasButton suspendablePatients={suspendablePatients} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.folio || 'N/A'}</TableCell>
                <TableCell>{patient.fullName}</TableCell>
                <TableCell>{patient.serviceName}</TableCell>
                <TableCell>{patient.frequency}x - {patient.scheduleType}</TableCell>
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
                  <EditPatientModal patient={patient} groupedServices={groupedServices} />
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No hay pacientes registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
