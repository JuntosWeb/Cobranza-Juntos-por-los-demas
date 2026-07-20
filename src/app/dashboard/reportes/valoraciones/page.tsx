import { PrismaClient } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function ValoracionesPage() {
  const valuations = await prisma.payment.findMany({
    where: { isQuickPayment: true },
    orderBy: { paymentDate: 'desc' }
  });

  const totalValuations = valuations.reduce((acc, p) => acc + p.finalAmountPaid, 0);

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
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Reporte de Valoraciones (Caja Rápida)</h1>
            <p className="text-slate-500 mt-1">Historial de pagos de primera vez / valoraciones médicas.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Total Ingresos Valoraciones</p>
          <h2 className="text-3xl font-extrabold mt-2 text-blue-600">${totalValuations.toFixed(2)}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nota / Folio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Notas Adicionales</TableHead>
              <TableHead className="text-right">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {valuations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  No hay valoraciones registradas.
                </TableCell>
              </TableRow>
            ) : (
              valuations.map((val) => (
                <TableRow key={val.id}>
                  <TableCell className="font-medium text-slate-600">{val.receiptNumber}</TableCell>
                  <TableCell>{format(val.paymentDate, "d 'de' MMMM, yyyy", { locale: es })}</TableCell>
                  <TableCell className="font-medium">{val.quickPaymentName}</TableCell>
                  <TableCell className="text-sm text-slate-600">{val.quickPaymentNotes || '-'}</TableCell>
                  <TableCell className="text-right font-bold text-slate-800">
                    ${val.finalAmountPaid.toFixed(2)}
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
