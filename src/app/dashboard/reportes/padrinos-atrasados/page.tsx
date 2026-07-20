import { getDelayedSponsors } from '@/lib/actions/sponsor.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function PadrinosAtrasadosPage() {
  const delayedSponsors = await getDelayedSponsors();

  const totalOwed = delayedSponsors.reduce((acc, s) => acc + (s.owedPeriods * s.monthlyCommitment), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Padrinos con Atraso</h1>
          <p className="text-slate-500 mt-1">Reporte de Padrinos que deben aportaciones según su periodicidad pactada.</p>
        </div>
        <Link href="/dashboard/reportes">
          <Button variant="outline">Volver a Reportes</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-red-600">Estimación de Deuda (Atrasos)</p>
          <h2 className="text-3xl font-extrabold mt-2 text-red-700">${totalOwed.toFixed(2)}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Padrino</TableHead>
              <TableHead>Periodicidad</TableHead>
              <TableHead>Compromiso Mensual</TableHead>
              <TableHead>Meses desde Registro</TableHead>
              <TableHead className="text-center">Periodos Atrasados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {delayedSponsors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  No hay padrinos con atrasos.
                </TableCell>
              </TableRow>
            ) : (
              delayedSponsors.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-muted-foreground block">Folio: {s.folio}</span>
                  </TableCell>
                  <TableCell>{s.periodicity}</TableCell>
                  <TableCell>${s.monthlyCommitment.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(s.createdAt), "MMM yyyy", { locale: es })}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive" className="text-xs">
                      Debe {s.owedPeriods} periodo(s)
                    </Badge>
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
