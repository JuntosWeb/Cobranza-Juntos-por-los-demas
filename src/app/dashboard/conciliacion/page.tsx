import { getPendingTransfers } from '@/lib/actions/payment.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApproveButton } from './ApproveButton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ConciliacionPage() {
  const payments = await getPendingTransfers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Conciliación de Transferencias</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha Registro</TableHead>
              <TableHead>Paciente (Folio)</TableHead>
              <TableHead>Monto (Total)</TableHead>
              <TableHead>Mes de Pago</TableHead>
              <TableHead>Registrado por</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell>
                  {payment.patient?.fullName} 
                  <span className="text-xs text-muted-foreground block">{payment.patient?.folio}</span>
                </TableCell>
                <TableCell className="font-bold text-green-600">
                  ${payment.finalAmountPaid.toFixed(2)}
                </TableCell>
                <TableCell>
                  {payment.chargeAllocations?.map((ca: any) => `${ca.charge.periodMonth}/${ca.charge.periodYear}`).join(', ') || 'N/A'}
                </TableCell>
                <TableCell>{payment.recordedBy}</TableCell>
                <TableCell className="text-right">
                  <ApproveButton paymentId={payment.id} />
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No hay transferencias pendientes por conciliar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
