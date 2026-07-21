import { getAuditReportData } from '@/lib/actions/report.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExportCsvButton } from './ExportCsvButton';

export const dynamic = 'force-dynamic';

export default async function AuditoriaPage({ searchParams }: { searchParams: { m?: string; y?: string } }) {
  const now = new Date();
  const month = searchParams.m ? parseInt(searchParams.m) : now.getMonth() + 1;
  const year = searchParams.y ? parseInt(searchParams.y) : now.getFullYear();

  const reportData = await getAuditReportData(month, year);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Reporte de Auditoría (Particulares)</h1>
          <p className="text-slate-500 mt-1">
            Bitácora operativa de cobranza para {month}/{year}.
          </p>
        </div>
        <div className="flex gap-4">
          <ExportCsvButton data={reportData} filename={`Auditoria_Cobranza_${year}_${month}.csv`} />
          <Link href="/dashboard/reportes">
            <Button variant="outline">Volver a Reportes</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead>Sem</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Folio</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>VxS</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Precio de Lista</TableHead>
              <TableHead>Insc. / Recargo</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Recargos</TableHead>
              <TableHead>Comentarios</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-10 text-slate-500">
                  No hay cargos generados en este periodo.
                </TableCell>
              </TableRow>
            ) : (
              reportData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.semanaDePago || '-'}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.folio}</TableCell>
                  <TableCell className="font-medium">{row.nombre}</TableCell>
                  <TableCell>{row.servicio}</TableCell>
                  <TableCell>{row.vxs}</TableCell>
                  <TableCell className="font-bold text-green-600">${row.pago.toFixed(2)}</TableCell>
                  <TableCell>${row.precioDeLista.toFixed(2)}</TableCell>
                  <TableCell>{row.inscripcionORecargo}</TableCell>
                  <TableCell>${row.descuento.toFixed(2)}</TableCell>
                  <TableCell className="text-red-600">${row.recargos.toFixed(2)}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate" title={row.comentarios}>{row.comentarios}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.estado === 'PAID' ? 'bg-green-100 text-green-700' : row.estado === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {row.estado}
                    </span>
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
