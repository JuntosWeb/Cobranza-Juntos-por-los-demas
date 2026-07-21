"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerExpense, cancelExpense } from '@/lib/actions/payment.actions';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

type Props = {
  recordedBy: string;
  recentExpenses: any[];
};

export function CajaRapidaGastosForm({ recordedBy, recentExpenses }: Props) {
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [authorizedBy, setAuthorizedBy] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelExpense = async (id: string) => {
    if (!confirm('¿Estás seguro de anular este gasto?')) return;
    setCancellingId(id);
    const res = await cancelExpense(id);
    setCancellingId(null);
    if (res.success) {
      alert('Gasto anulado correctamente');
    } else {
      alert(res.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || !amount) return;

    setIsSubmitting(true);
    const finalNotes = `Autorizado por: ${authorizedBy || 'N/A'} | Recibido por: ${receivedBy || 'N/A'}${notes ? ` | Notas: ${notes}` : ''}`;
    const res = await registerExpense(concept, Number(amount), finalNotes, recordedBy);
    setIsSubmitting(false);

    if (res.success) {
      alert('Gasto registrado exitosamente');
      setConcept('');
      setAmount('');
      setAuthorizedBy('');
      setReceivedBy('');
      setNotes('');
    } else {
      alert(res.error || 'Ocurrió un error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Concepto del Gasto / Área</Label>
        <Input required placeholder="Ej: Papelería, Mantenimiento Alberca" value={concept} onChange={e => setConcept(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Monto ($)</Label>
        <Input required type="number" min="1" placeholder="0.00" value={amount} onChange={e => setAmount(Number(e.target.value))} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Autorizado por (Opcional)</Label>
          <Input placeholder="Ej. Dirección" value={authorizedBy} onChange={e => setAuthorizedBy(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Recibido por (Opcional)</Label>
          <Input placeholder="Quién se llevó el dinero" value={receivedBy} onChange={e => setReceivedBy(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notas Adicionales (Opcional)</Label>
        <Input placeholder="Folio de factura o ticket" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full" variant="destructive">
        {isSubmitting ? 'Procesando...' : 'Registrar Salida de Efectivo'}
      </Button>

      <div className="pt-8 mt-8 border-t">
        <h3 className="font-bold mb-4">Gastos Recientes</h3>
        {recentExpenses.length === 0 ? (
          <p className="text-sm text-slate-500">No hay gastos registrados recientemente.</p>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map(exp => (
              <div key={exp.id} className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
                <div>
                  <p className="font-semibold">{exp.concept}</p>
                  <p className="text-xs text-slate-500">{format(new Date(exp.createdAt), 'dd/MM/yyyy HH:mm')} | ${exp.amount.toFixed(2)}</p>
                  {exp.notes && <p className="text-xs text-slate-400">{exp.notes}</p>}
                </div>
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleCancelExpense(exp.id)}
                  disabled={cancellingId === exp.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
