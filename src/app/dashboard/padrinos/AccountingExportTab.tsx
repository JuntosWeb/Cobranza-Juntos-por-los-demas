"use client";

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { updateSponsorPaymentReceipt } from '@/lib/actions/sponsor.actions';

// esta tablita sirve para exportar la info
const methodEs: Record<string, string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  TC: 'Tarjeta / Plataforma',
  DEPOSITO: 'Depósito',
  ESPECIE: 'Especie'
};

export function AccountingExportTab({ sponsors }: { sponsors: any[] }) {
  const [month, setMonth] = useState(new Date().getMonth().toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const allPayments = useMemo(() => {
    const payments: any[] = [];
    sponsors.forEach(s => {
      s.sponsorPayments.forEach((p: any) => {
        if (p.status === 'COMPLETED') {
          payments.push({ ...p, sponsorName: s.name });
        }
      });
    });
    return payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [sponsors]);

  const filteredPayments = useMemo(() => {
    return allPayments.filter(p => {
      const d = new Date(p.paymentDate);
      if (isNaN(d.getTime())) return false;
      return d.getMonth().toString() === month && d.getFullYear().toString() === year;
    });
  }, [allPayments, month, year]);

  const totalIngreso = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalComision = filteredPayments.reduce((sum, p) => sum + p.commission, 0);
  const totalNeto = totalIngreso - totalComision;

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Padrino', 'Monto Bruto', 'Comision', 'Monto Neto', 'Metodo', 'Folio CONTPAQ'];
    const csvData = filteredPayments.map(p => [
      new Date(p.paymentDate).toLocaleDateString(),
      `"${p.sponsorName}"`,
      p.amount,
      p.commission,
      p.amount - p.commission,
      methodEs[p.paymentMethod] || p.paymentMethod,
      p.receiptNumber || ''
    ]);
    
    csvData.push(['', 'TOTALES', totalIngreso, totalComision, totalNeto, '', '']);
    
    const csvString = [headers.join(','), ...csvData.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contabilidad_Padrinos_${month}_${year}.csv`;
    a.click();
  };

  const handleUpdateFolio = async (id: string, folio: string) => {
    setUpdatingId(id);
    await updateSponsorPaymentReceipt(id, folio);
    setUpdatingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100">
        <div className="flex gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500 font-medium">Mes</label>
            <Select value={month} onValueChange={(v) => v && setMonth(v)}>
              <SelectTrigger className="w-[120px]"><SelectValue/></SelectTrigger>
              <SelectContent>
                {Array.from({length: 12}).map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>{new Date(0, i).toLocaleString('es', { month: 'long' })}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500 font-medium">Año</label>
            <Select value={year} onValueChange={(v) => v && setYear(v)}>
              <SelectTrigger className="w-[100px]"><SelectValue/></SelectTrigger>
              <SelectContent>
                {[2025, 2026, 2027, 2028].map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Exportar a CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Ingreso Bruto</p>
          <p className="text-2xl font-bold text-blue-900">${totalIngreso.toFixed(2)}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-sm text-orange-600 font-medium">Comisiones Restadas</p>
          <p className="text-2xl font-bold text-orange-900">-${totalComision.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-sm text-green-600 font-medium">Ingreso Neto a Banco</p>
          <p className="text-2xl font-bold text-green-900">${totalNeto.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Padrino</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Comisión</TableHead>
              <TableHead className="text-right">Neto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Folio CONTPAQ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-500">No hay pagos registrados en este mes.</TableCell></TableRow>
            ) : (
              filteredPayments.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{p.sponsorName}</TableCell>
                  <TableCell className="text-right">${p.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-orange-600">-${p.commission.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-700">${(p.amount - p.commission).toFixed(2)}</TableCell>
                  <TableCell>{methodEs[p.paymentMethod] || p.paymentMethod}</TableCell>
                  <TableCell>
                    <Input 
                      defaultValue={p.receiptNumber || ''}
                      className="w-32 h-8 text-xs"
                      placeholder="Folio Factura"
                      onBlur={(e) => {
                        if (e.target.value !== (p.receiptNumber || '')) {
                          handleUpdateFolio(p.id, e.target.value);
                        }
                      }}
                      disabled={updatingId === p.id}
                    />
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
