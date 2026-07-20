"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerExpense } from '@/lib/actions/payment.actions';

type Props = {
  recordedBy: string;
};

export function CajaRapidaGastosForm({ recordedBy }: Props) {
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || !amount) return;

    setIsSubmitting(true);
    const res = await registerExpense(concept, Number(amount), notes, recordedBy);
    setIsSubmitting(false);

    if (res.success) {
      alert('Gasto registrado exitosamente');
      setConcept('');
      setAmount('');
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
      <div className="space-y-2">
        <Label>Notas Adicionales (Opcional)</Label>
        <Input placeholder="Quién solicitó, folio de factura, etc." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full" variant="destructive">
        {isSubmitting ? 'Procesando...' : 'Registrar Salida de Efectivo'}
      </Button>
    </form>
  );
}
