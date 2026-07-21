"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerSponsorPayment } from '@/lib/actions/sponsor.actions';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  sponsor: any;
};

export function SponsorPaymentModal({ isOpen, onClose, sponsor }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: sponsor.monthlyCommitment.toString(),
    commission: '0',
    paymentMethod: 'TRANSFER',
    periodCovered: '',
    receiptNumber: '',
    authorizationCode: '',
    cfdiUse: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await registerSponsorPayment({
      sponsorId: sponsor.id,
      amount: Number(formData.amount),
      commission: Number(formData.commission),
      paymentDate: new Date(),
      paymentMethod: formData.paymentMethod,
      periodCovered: formData.periodCovered,
      receiptNumber: formData.receiptNumber,
      authorizationCode: formData.authorizationCode,
      cfdiUse: formData.cfdiUse,
      notes: formData.notes
    });
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      alert(res.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Ingreso - {sponsor.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monto Donativo ($)</Label>
              <Input 
                type="number"
                required
                min="0"
                value={formData.amount} 
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Mes(es) que cubre</Label>
              <Select 
                value={formData.periodCovered} 
                onValueChange={v => setFormData({ ...formData, periodCovered: v as string })}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar Mes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENERO">Enero</SelectItem>
                  <SelectItem value="FEBRERO">Febrero</SelectItem>
                  <SelectItem value="MARZO">Marzo</SelectItem>
                  <SelectItem value="ABRIL">Abril</SelectItem>
                  <SelectItem value="MAYO">Mayo</SelectItem>
                  <SelectItem value="JUNIO">Junio</SelectItem>
                  <SelectItem value="JULIO">Julio</SelectItem>
                  <SelectItem value="AGOSTO">Agosto</SelectItem>
                  <SelectItem value="SEPTIEMBRE">Septiembre</SelectItem>
                  <SelectItem value="OCTUBRE">Octubre</SelectItem>
                  <SelectItem value="NOVIEMBRE">Noviembre</SelectItem>
                  <SelectItem value="DICIEMBRE">Diciembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <Select 
                  value={formData.paymentMethod} 
                  onValueChange={v => setFormData({ ...formData, paymentMethod: v as string })}
                  items={{
                    TRANSFER: 'Transferencia',
                    TC: 'Tarjeta / Plataforma',
                    DEPOSITO: 'Depósito',
                    ESPECIE: 'Especie'
                  }}
                >
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSFER">Transferencia</SelectItem>
                  <SelectItem value="TC">Tarjeta / Plataforma</SelectItem>
                  <SelectItem value="DEPOSITO">Depósito</SelectItem>
                  <SelectItem value="ESPECIE">Especie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.paymentMethod === 'TC' || formData.paymentMethod === 'TRANSFER') && (
              <div className="space-y-2">
                <Label>Comisión (Stripe, Banco, etc.)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.commission}
                  onChange={e => setFormData({ ...formData, commission: e.target.value })}
                  placeholder="Ej. 50.00"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>No. Recibo / Donativo</Label>
              <Input 
                value={formData.receiptNumber} 
                onChange={e => setFormData({ ...formData, receiptNumber: e.target.value })}
                placeholder="Ej. YZ-24"
              />
            </div>
            <div className="space-y-2">
              <Label>Autorización (TC)</Label>
              <Input 
                value={formData.authorizationCode} 
                onChange={e => setFormData({ ...formData, authorizationCode: e.target.value })}
                placeholder="Solo tarjetas"
              />
            </div>
          </div>

          {formData.paymentMethod === 'ESPECIE' && (
            <div className="space-y-2">
              <Label>Uso CFDI</Label>
              <Input 
                value={formData.cfdiUse} 
                onChange={e => setFormData({ ...formData, cfdiUse: e.target.value })}
                placeholder="Ej. G03"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Notas</Label>
            <Input 
              value={formData.notes} 
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Ingreso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
