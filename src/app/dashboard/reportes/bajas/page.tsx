import { PrismaClient } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function BajasPage() {
  const suspendedPatients = await prisma.patient.findMany({
    where: { status: 'SUSPENDED' },
    include: {
      services: { include: { service: true } },
      charges: {
        where: { status: 'PENDING' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  const totalDebt = suspendedPatients.reduce((acc, p) => {
    return acc + p.charges.reduce((sum, c) => sum + c.baseAmount + c.lateFee, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reportes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Reporte de Bajas (Inactivos)</h1>
            <p className="text-slate-500 mt-1">Pacientes suspendidos por falta de pago y su deuda histórica.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-slate-500">Deuda Histórica Total</p>
          <h2 className="text-3xl font-extrabold mt-2 text-red-600">${totalDebt.toFixed(2)}</h2>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-slate-500">Total Bajas</p>
          <h2 className="text-3xl font-extrabold mt-2 text-slate-800">{suspendedPatients.length}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Nombre del Paciente</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Fecha de Baja</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead className="text-right">Deuda Histórica</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suspendedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                  No hay pacientes dados de baja.
                </TableCell>
              </TableRow>
            ) : (
              suspendedPatients.map((patient) => {
                const patientDebt = patient.charges.reduce((sum, c) => sum + c.baseAmount + c.lateFee, 0);

                return (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.folio || 'N/A'}</TableCell>
                    <TableCell>{patient.fullName}</TableCell>
                    <TableCell>{patient.services[0]?.service?.name || 'N/A'}</TableCell>
                    <TableCell>{format(patient.updatedAt, "d 'de' MMMM, yyyy", { locale: es })}</TableCell>
                    <TableCell className="max-w-xs truncate" title={patient.suspensionReason || 'No especificado'}>
                      {patient.suspensionReason || 'Falta de pago'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      ${patientDebt.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
