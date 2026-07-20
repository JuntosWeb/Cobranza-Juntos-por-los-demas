"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { suspendPatients } from '@/lib/actions/patient.actions';

type SuspendablePatient = {
  id: string;
  folio: string | null;
  fullName: string;
  lastPaymentDate?: Date;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  suspendablePatients: SuspendablePatient[];
};

export function BajasModal({ isOpen, onClose, suspendablePatients }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === suspendablePatients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(suspendablePatients.map(p => p.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;
    if (!reason.trim()) {
      alert('Por favor ingresa un motivo para la baja');
      return;
    }
    setIsSubmitting(true);
    const res = await suspendPatients(selectedIds, reason);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
      setSelectedIds([]);
    } else {
      alert(res.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Revisar Bajas por Falta de Pago</DialogTitle>
          <DialogDescription>
            Estos pacientes tienen más de 4 semanas sin registrar un pago. Selecciona los que deseas suspender del sistema. Recuerda que la deuda histórica se mantendrá.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[300px] overflow-y-auto space-y-3 py-4 border-t border-b">
          {suspendablePatients.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay pacientes en riesgo de suspensión.</p>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="selectAll" 
                  checked={selectedIds.length === suspendablePatients.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="selectAll" className="text-sm font-semibold cursor-pointer">Seleccionar Todos</label>
              </div>
              {suspendablePatients.map(p => (
                <div key={p.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-md border">
                  <Checkbox 
                    id={`chk-${p.id}`} 
                    checked={selectedIds.includes(p.id)}
                    onCheckedChange={(c) => handleToggle(p.id, c as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor={`chk-${p.id}`} className="text-sm font-medium leading-none cursor-pointer">
                      {p.folio && <span className="text-muted-foreground text-xs mr-2">{p.folio}</span>}
                      {p.fullName}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Último pago: {p.lastPaymentDate ? new Date(p.lastPaymentDate).toLocaleDateString() : 'Ninguno'}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="py-2 px-4 space-y-2">
          <label className="text-sm font-medium">Motivo de la baja (Aplica para todos los seleccionados)</label>
          <input 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ej. Salió del país, Problemas de salud..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit} 
            disabled={selectedIds.length === 0 || isSubmitting || !reason.trim()}
          >
            {isSubmitting ? 'Suspendiendo...' : `Suspender (${selectedIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
