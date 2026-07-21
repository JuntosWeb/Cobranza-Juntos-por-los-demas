import prisma from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, FileText, UserX, AlertTriangle, Receipt, Stethoscope } from 'lucide-react';

export const dynamic = 'force-dynamic';



export default async function ReportesPage() {
  // Para el MVP, obtenemos los últimos 50 pagos de ambos
  const payments = await prisma.payment.findMany({
    take: 50,
    orderBy: { paymentDate: 'desc' },
    include: {
      patient: true,
      chargeAllocations: { include: { charge: true } }
    }
  });

  const sponsorPayments = await prisma.sponsorPayment.findMany({
    take: 50,
    orderBy: { paymentDate: 'desc' },
    include: { sponsor: true }
  });

  const allPayments = [
    ...payments.map(p => ({ ...p, type: 'PATIENT' as const })),
    ...sponsorPayments.map(p => ({ ...p, type: 'SPONSOR' as const, finalAmountPaid: p.amount }))
  ].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 50);

  // Calculamos ingresos EXCLUYENDO pagos EN ESPECIE (no es dinero líquido)
  const totalIngresos = allPayments.reduce((acc, p) => {
    if (p.paymentMethod === 'ESPECIE') return acc;
    return acc + p.finalAmountPaid;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 gap-4 xl:gap-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Reporte de Ingresos</h1>
        
        {/* Mobile / Tablet View: Dropdown Menu */}
        <div className="xl:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="w-full sm:w-auto font-semibold shadow-sm" />}>
              <FileText className="w-4 h-4 mr-2" />
              Más Reportes
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 font-outfit">
              <Link href="/dashboard/reportes/valoraciones">
                <DropdownMenuItem className="cursor-pointer">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Valoraciones Médicas
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/reportes/bajas">
                <DropdownMenuItem className="cursor-pointer">
                  <UserX className="w-4 h-4 mr-2" />
                  Reporte de Bajas
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/reportes/padrinos-atrasados">
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Padrinos Atrasados
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/reportes/facturacion">
                <DropdownMenuItem className="cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50">
                  <Receipt className="w-4 h-4 mr-2" />
                  Recibos de Donativo
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/reportes/auditoria">
                <DropdownMenuItem className="cursor-pointer text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Auditoría
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop View: Full Buttons */}
        <div className="hidden xl:flex gap-4">
          <Link href="/dashboard/reportes/valoraciones">
            <Button variant="outline">Ver Valoraciones Médicas</Button>
          </Link>
          <Link href="/dashboard/reportes/bajas">
            <Button variant="outline">Ver Reporte de Bajas</Button>
          </Link>
          <Link href="/dashboard/reportes/padrinos-atrasados">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Ver Padrinos Atrasados</Button>
          </Link>
          <Link href="/dashboard/reportes/facturacion">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">Recibos de Donativo</Button>
          </Link>
          <Link href="/dashboard/reportes/auditoria">
            <Button variant="outline" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50">Auditoría (Particulares)</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ingresos (últimos 50 pagos)</p>
          <h2 className="text-3xl font-extrabold mt-2 text-green-600">${totalIngresos.toFixed(2)}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-x-auto">
        <Table className="min-w-[800px] whitespace-nowrap">
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
            {allPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  No hay pagos registrados aún.
                </TableCell>
              </TableRow>
            ) : (
              allPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{format(payment.paymentDate, "d 'de' MMMM, yyyy", { locale: es })}</TableCell>
                  <TableCell>
                    {payment.type === 'SPONSOR' ? (
                      <div className="flex flex-col">
                        <span className="font-medium">Padrino: {(payment as any).sponsor?.name}</span>
                        <span className="text-xs text-slate-500">Donativo {(payment as any).periodCovered || ''}</span>
                      </div>
                    ) : (payment as any).isQuickPayment ? (
                      <div className="flex flex-col">
                        <span className="font-medium">Caja Rápida: {(payment as any).quickPaymentName}</span>
                        {(payment as any).quickPaymentNotes && (
                          <span className="text-xs text-slate-500">Nota: {(payment as any).quickPaymentNotes}</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-medium">Paciente: {(payment as any).patient?.fullName}</span>
                        <span className="text-xs text-slate-500">
                          Cubrió {(payment as any).chargeAllocations?.length} mes(es)
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.paymentMethod}
                    {payment.paymentMethod === 'ESPECIE' && <span className="block text-[10px] text-orange-500">(No suma al total)</span>}
                  </TableCell>
                  <TableCell className="text-xs">{(payment as any).recordedBy || 'Sistema'}</TableCell>
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
