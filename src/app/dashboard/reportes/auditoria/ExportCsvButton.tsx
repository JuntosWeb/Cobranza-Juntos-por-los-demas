"use client";

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type Props = {
  data: any[];
  filename: string;
};

export function ExportCsvButton({ data, filename }: Props) {
  const handleExport = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'Semana',
      'Área',
      'Folio',
      'Nombre',
      'Servicio',
      'VxS',
      'Pago',
      'Precio de Lista',
      'Inscripción/Recargo',
      'Descuento',
      'Recargos',
      'Comentarios',
      'Estado'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.semanaDePago || '',
        `"${row.area}"`,
        `"${row.folio}"`,
        `"${row.nombre}"`,
        `"${row.servicio}"`,
        row.vxs,
        row.pago,
        row.precioDeLista,
        `"${row.inscripcionORecargo}"`,
        row.descuento,
        row.recargos,
        `"${row.comentarios.replace(/"/g, '""')}"`,
        row.estado
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white gap-2">
      <Download className="w-4 h-4" />
      Exportar CSV
    </Button>
  );
}
