"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { registerPayment } from '@/lib/actions/payment.actions';
import { PaymentMethod, Charge } from '@prisma/client';

type PendingCharge = Charge & { calculatedLateFee: number };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  pendingCharges: PendingCharge[];
  recordedBy: string;
};

export function PaymentModal({ 
  isOpen, 
  onClose, 
  patientId, 
  patientName, 
  pendingCharges,
  recordedBy
}: Props) {
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);
  const [customDiscount, setCustomDiscount] = useState<number | ''>('');
  const [customDiscountReason, setCustomDiscountReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPaymentId, setSuccessPaymentId] = useState<string | null>(null);

  const handleToggleCharge = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedChargeIds(prev => [...prev, id]);
    } else {
      setSelectedChargeIds(prev => prev.filter(x => x !== id));
    }
  };

  // Cálculos dinámicos
  const selectedCharges = pendingCharges.filter(c => selectedChargeIds.includes(c.id));
  const totalBaseAmount = selectedCharges.reduce((acc, c) => acc + c.baseAmount, 0);
  const totalLateFee = selectedCharges.reduce((acc, c) => acc + c.calculatedLateFee, 0);
  
  // Descuento trimestral automático si paga 3 o más cargos de una vez
  const isQuarterly = selectedCharges.length >= 3;
  const quarterlyDiscountAmount = isQuarterly ? totalBaseAmount * 0.10 : 0;
  
  const discountPercentage = Number(customDiscount) || 0;
  const discountValue = (discountPercentage / 100) * totalBaseAmount;
  const finalAmount = totalBaseAmount + totalLateFee - quarterlyDiscountAmount - discountValue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChargeIds.length === 0) {
      alert('Selecciona al menos un cargo a pagar');
      return;
    }

    setIsSubmitting(true);

    const res = await registerPayment({
      patientId,
      chargeIds: selectedChargeIds,
      totalBaseAmount,
      totalLateFee,
      quarterlyDiscount: quarterlyDiscountAmount,
      customDiscount: discountValue,
      customDiscountReason,
      finalAmountPaid: Math.max(finalAmount, 0),
      paymentMethod,
      recordedBy,
    });

    setIsSubmitting(false);
    if (res.success && res.payment) {
      setSuccessPaymentId(res.payment.id);
      setSelectedChargeIds([]);
      setCustomDiscount('');
    } else {
      alert(res.error || 'Ocurrió un error');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setSuccessPaymentId(null);
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{successPaymentId ? 'Pago Exitoso' : `Registrar Pago - ${patientName}`}</DialogTitle>
        </DialogHeader>

        {successPaymentId ? (
          <div className="py-10 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">¡Cobro Registrado!</h3>
              <p className="text-slate-500 mt-1">El pago se ha guardado correctamente.</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
              <Button onClick={() => window.open(`/ticket/${successPaymentId}`, '_blank')} className="w-full flex items-center gap-2" variant="default">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Imprimir Ticket
              </Button>
              <Button onClick={() => { setSuccessPaymentId(null); onClose(); }} variant="outline" className="w-full">
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label>Cargos Pendientes (Estado de Cuenta)</Label>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
              {pendingCharges.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No hay adeudos.</p>
              ) : (
                pendingCharges.map(c => (
                  <div key={c.id} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`charge-${c.id}`}
                      checked={selectedChargeIds.includes(c.id)}
                      onCheckedChange={(checked) => handleToggleCharge(c.id, checked as boolean)}
                    />
                    <label htmlFor={`charge-${c.id}`} className="text-sm flex-1 cursor-pointer">
                      Mes {c.periodMonth}/{c.periodYear} 
                      <span className="ml-2 font-semibold">${c.baseAmount}</span>
                      {c.calculatedLateFee > 0 && (
                        <span className="ml-2 text-xs text-orange-600">(+${c.calculatedLateFee} mora)</span>
                      )}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">Descuento Extra (%)</Label>
            <Input 
              id="discount" 
              type="number" 
              min="0" 
              max="100"
              className="col-span-3" 
              value={customDiscount}
              onChange={(e) => setCustomDiscount(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          {discountValue > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right text-xs">Motivo</Label>
              <Input 
                id="reason" 
                placeholder="Razón del descuento" 
                className="col-span-3" 
                required 
                value={customDiscountReason}
                onChange={(e) => setCustomDiscountReason(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Método</Label>
            <div className="col-span-3">
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
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
          </div>

          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Cargos Seleccionados ({selectedCharges.length}):</span>
              <span>${totalBaseAmount.toFixed(2)}</span>
            </div>
            {totalLateFee > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Recargos por mora acumulados:</span>
                <span>+${totalLateFee.toFixed(2)}</span>
              </div>
            )}
            {isQuarterly && (
              <div className="flex justify-between text-green-600">
                <span>Descuento Trimestral (-10%):</span>
                <span>-${quarterlyDiscountAmount.toFixed(2)}</span>
              </div>
            )}
            {discountValue > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento Especial ({discountPercentage}%):</span>
                <span>-${discountValue.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total a Cobrar:</span>
              <span>${Math.max(finalAmount, 0).toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || selectedChargeIds.length === 0}>
              {isSubmitting ? 'Procesando...' : 'Guardar Pago'}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
