import { PrismaClient } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function ReportesPage() {
  // Para el MVP, obtenemos los últimos 50 pagos
  const payments = await prisma.payment.findMany({
    take: 50,
    orderBy: { paymentDate: 'desc' },
    include: {
      patient: true,
      chargeAllocations: {
        include: { charge: true }
      }
    }
  });

  const totalIngresos = payments.reduce((acc, p) => acc + p.finalAmountPaid, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Reporte de Ingresos</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ingresos (últimos 50 pagos)</p>
          <h2 className="text-3xl font-extrabold mt-2 text-green-600">${totalIngresos.toFixed(2)}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Concepto / Paciente</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Registrado Por</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  No hay pagos registrados aún.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{format(payment.paymentDate, "d 'de' MMMM, yyyy", { locale: es })}</TableCell>
                  <TableCell>
                    {payment.isQuickPayment ? (
                      <div className="flex flex-col">
                        <span className="font-medium">Caja Rápida: {payment.quickPaymentName}</span>
                        {payment.quickPaymentNotes && (
                          <span className="text-xs text-slate-500">Nota: {payment.quickPaymentNotes}</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-medium">{payment.patient?.fullName}</span>
                        <span className="text-xs text-slate-500">
                          Cubrió {payment.chargeAllocations.length} mes(es)
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell className="text-xs">{payment.recordedBy}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    ${payment.finalAmountPaid.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
