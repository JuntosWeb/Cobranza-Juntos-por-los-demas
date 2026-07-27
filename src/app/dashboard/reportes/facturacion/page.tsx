import { getPaymentsForBilling } from '@/lib/actions/payment.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

const methodEs: Record<string, string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  TC: 'Tarjeta / Plataforma',
  DEPOSITO: 'Depósito',
  ESPECIE: 'Especie'
};

export default async function FacturacionPage() {
  const payments = await getPaymentsForBilling();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Recibos de Donativo</h1>
          <p className="text-slate-500 mt-1">Pagos de Padrinos que requieren facturación (CFDI).</p>
        </div>
        <Link href="/dashboard/reportes">
          <Button variant="outline">Volver a Reportes</Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha de Pago</TableHead>
              <TableHead>Padrino / Donante</TableHead>
              <TableHead>Monto Donado</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Uso CFDI</TableHead>
              <TableHead>Datos Fiscales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No hay pagos que requieran factura.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{format(p.paymentDate, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <span className="font-medium">{(p as any).sponsor?.name}</span>
                    <span className="block text-xs text-slate-500">Folio: {(p as any).sponsor?.folio}</span>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    ${p.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{methodEs[p.paymentMethod] || p.paymentMethod}</TableCell>
                  <TableCell>{p.cfdiUse || 'Por definir'}</TableCell>
                  <TableCell className="text-xs max-w-xs break-words">
                    {(p as any).sponsor?.billingData || 'No especificados'}
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
