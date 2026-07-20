"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createExtraordinaryCharge } from '@/lib/actions/patient.actions';

type Props = {
  patientId: string;
  patientName: string;
};

export function ExtraChargeModal({ patientId, patientName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || !amount) return;
    setIsSubmitting(true);
    const res = await createExtraordinaryCharge(patientId, concept, Number(amount));
    setIsSubmitting(false);
    if (res.success) {
      setIsOpen(false);
      setConcept('');
      setAmount('');
    } else {
      alert(res.error);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="ml-2">
        Cargo Extra
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Generar Cargo Extraordinario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Paciente</Label>
              <Input value={patientName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Concepto (Ej. Inscripción)</Label>
              <Input required value={concept} onChange={e => setConcept(e.target.value)} placeholder="Inscripción 2026" />
            </div>
            <div className="space-y-2">
              <Label>Monto ($)</Label>
              <Input required type="number" min="1" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="500" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Generar Cargo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
