"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerPayment } from '@/lib/actions/payment.actions';
import { PaymentMethod } from '@prisma/client';

type Props = {
  recordedBy: string;
};

export function CajaRapidaForm({ recordedBy }: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLastReceipt(null);

    const res = await registerPayment({
      isQuickPayment: true,
      quickPaymentName: name,
      quickPaymentNotes: notes,
      totalBaseAmount: Number(amount),
      finalAmountPaid: Number(amount),
      paymentMethod,
      recordedBy,
    });

    setIsSubmitting(false);
    if (res.success && res.payment) {
      setLastReceipt(res.payment.receiptNumber);
      setName('');
      setAmount('');
      setNotes('');
      setPaymentMethod('CASH');
    } else {
      alert(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la persona (o motivo)</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Juan Pérez - Valoración"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Monto a cobrar ($)</Label>
        <Input 
          id="amount"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Concepto / Comentarios (Opcional)</Label>
        <Input 
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej. F/4969"
        />
      </div>

      <div className="space-y-2">
        <Label>Método de Pago</Label>
        <Select 
          value={paymentMethod} 
          onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
          items={{
            CASH: 'Efectivo',
            CARD: 'Tarjeta',
            TRANSFER: 'Transferencia'
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Efectivo</SelectItem>
            <SelectItem value="CARD">Tarjeta</SelectItem>
            <SelectItem value="TRANSFER">Transferencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar Cobro'}
      </Button>

      {lastReceipt && (
        <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-md border-green-200 text-center">
          <p className="font-semibold">¡Cobro registrado exitosamente!</p>
          <p className="text-2xl font-bold mt-2">Folio: {lastReceipt}</p>
        </div>
      )}
    </form>
  );
}
