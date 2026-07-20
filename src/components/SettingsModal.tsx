"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Trash2 } from 'lucide-react';
import { updateSystemSettings } from '@/lib/actions/settings.actions';
import { format } from 'date-fns';

type Props = {
  settings: {
    holidays: Date[];
    lateFeePercentage: number;
    quarterlyDiscount: number;
    daysBeforeLateFee: number;
    weeksBeforeSuspension: number;
  };
};

export function SettingsModal({ settings }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [holidays, setHolidays] = useState<Date[]>(settings.holidays);
  const [newHoliday, setNewHoliday] = useState('');

  const handleAddHoliday = () => {
    if (newHoliday) {
      // Force UTC time to avoid timezone shifts
      const d = new Date(`${newHoliday}T00:00:00Z`);
      setHolidays([...holidays, d]);
      setNewHoliday('');
    }
  };

  const handleRemoveHoliday = (index: number) => {
    const newHolidays = [...holidays];
    newHolidays.splice(index, 1);
    setHolidays(newHolidays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await updateSystemSettings({
      holidays: holidays
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} title="Configuración Global">
        <Settings className="w-5 h-5 text-slate-500" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configuración Global</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label>Días Festivos Oficiales</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newHoliday}
                  onChange={(e) => setNewHoliday(e.target.value)}
                />
                <Button type="button" variant="secondary" onClick={handleAddHoliday}>Agregar</Button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                {holidays.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map((h, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded border text-sm">
                    <span>{new Date(h).toISOString().split('T')[0]}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => handleRemoveHoliday(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {holidays.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-2">No hay días festivos configurados.</p>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Estos días se saltarán al calcular el 5to día hábil para el recargo del 10%.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
