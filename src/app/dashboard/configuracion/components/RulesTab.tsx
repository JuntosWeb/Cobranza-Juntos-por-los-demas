"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Save } from 'lucide-react';
import { updateSystemSettings } from '@/lib/actions/settings.actions';
import { ForceGenerateButton } from './ForceGenerateButton';

import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  settings: {
    holidays: Date[];
    lateFeePercentage: number;
    quarterlyDiscount: number;
    daysBeforeLateFee: number;
    weeksBeforeSuspension: number;
    inscriptionFee: number;
    patientCategories: string[];
    scheduleTypes: string[];
    exemptDiscountedFromLateFees: boolean;
  };
};

export function RulesTab({ settings }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lateFeePercentage, setLateFeePercentage] = useState(settings.lateFeePercentage * 100);
  const [daysBeforeLateFee, setDaysBeforeLateFee] = useState(settings.daysBeforeLateFee);
  const [weeksBeforeSuspension, setWeeksBeforeSuspension] = useState(settings.weeksBeforeSuspension);
  const [holidays, setHolidays] = useState<Date[]>(settings.holidays);
  const [newHoliday, setNewHoliday] = useState('');
  
  const [inscriptionFee, setInscriptionFee] = useState(settings.inscriptionFee);
  const [patientCategories, setPatientCategories] = useState<string[]>(settings.patientCategories);
  const [newCategory, setNewCategory] = useState('');
  const [scheduleTypes, setScheduleTypes] = useState<string[]>(settings.scheduleTypes);
  const [newScheduleType, setNewScheduleType] = useState('');
  const [exemptDiscounted, setExemptDiscounted] = useState(settings.exemptDiscountedFromLateFees);

  const handleAddHoliday = () => {
    if (newHoliday) {
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
      lateFeePercentage: lateFeePercentage / 100,
      daysBeforeLateFee,
      weeksBeforeSuspension,
      holidays,
      inscriptionFee,
      patientCategories,
      scheduleTypes,
      exemptDiscountedFromLateFees: exemptDiscounted
    });

    setIsSubmitting(false);
    if (res.success) {
      alert('Reglas guardadas correctamente');
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">
      <div>
        <h3 className="text-lg font-semibold mb-4">Parámetros Operativos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Recargo por mora (%)</Label>
            <Input 
              type="number"
              min="0"
              step="1"
              value={lateFeePercentage} 
              onChange={e => setLateFeePercentage(Number(e.target.value))}
            />
            <p className="text-xs text-slate-500">Porcentaje extra aplicado en recibos tardíos.</p>
          </div>
          <div className="space-y-2">
            <Label>Días de gracia (Hábiles)</Label>
            <Input 
              type="number"
              min="0"
              step="1"
              value={daysBeforeLateFee} 
              onChange={e => setDaysBeforeLateFee(Number(e.target.value))}
            />
            <p className="text-xs text-slate-500">Días permitidos antes de aplicar el recargo.</p>
          </div>
          <div className="space-y-2">
            <Label>Semanas para Baja</Label>
            <Input 
              type="number"
              min="0"
              step="1"
              value={weeksBeforeSuspension} 
              onChange={e => setWeeksBeforeSuspension(Number(e.target.value))}
            />
            <p className="text-xs text-slate-500">Semanas de adeudo para suspender paciente.</p>
          </div>
          <div className="space-y-2">
            <Label>Cuota de Inscripción ($)</Label>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={inscriptionFee} 
              onChange={e => setInscriptionFee(Number(e.target.value))}
            />
            <p className="text-xs text-slate-500">Costo base de inscripción para nuevos pacientes.</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Categorías de Pacientes</h3>
        <div className="flex gap-2 max-w-sm mb-4">
          <Input
            type="text"
            placeholder="Ej. BECA 100%"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={() => {
            if (newCategory && !patientCategories.includes(newCategory)) {
              setPatientCategories([...patientCategories, newCategory]);
              setNewCategory('');
            }
          }}>Agregar</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {patientCategories.map((cat, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded border text-sm">
              <span>{cat}</span>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => {
                const newCats = [...patientCategories];
                newCats.splice(i, 1);
                setPatientCategories(newCats);
              }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Tipos de Horario</h3>
        <div className="flex gap-2 max-w-sm mb-4">
          <Input
            type="text"
            placeholder="Ej. Matutino"
            value={newScheduleType}
            onChange={(e) => setNewScheduleType(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={() => {
            if (newScheduleType && !scheduleTypes.includes(newScheduleType)) {
              setScheduleTypes([...scheduleTypes, newScheduleType]);
              setNewScheduleType('');
            }
          }}>Agregar</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {scheduleTypes.map((type, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded border text-sm">
              <span>{type}</span>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => {
                const newTypes = [...scheduleTypes];
                newTypes.splice(i, 1);
                setScheduleTypes(newTypes);
              }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <Checkbox 
            id="exempt"
            checked={exemptDiscounted}
            onCheckedChange={(c) => setExemptDiscounted(c as boolean)}
          />
          <Label htmlFor="exempt" className="font-medium">
            Exentar de recargos a pacientes con descuento especial de Dirección
          </Label>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Días Festivos Oficiales</h3>
        <p className="text-sm text-slate-600 mb-4">
          Estos días se saltarán al calcular los días hábiles para los recargos.
        </p>
        <div className="flex gap-2 max-w-sm mb-4">
          <Input
            type="date"
            value={newHoliday}
            onChange={(e) => setNewHoliday(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={handleAddHoliday}>Agregar</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {holidays.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map((h, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded border text-sm">
              <span>{new Date(h).toISOString().split('T')[0]}</span>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => handleRemoveHoliday(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {holidays.length === 0 && (
            <p className="text-sm text-slate-500 col-span-4">No hay días festivos configurados.</p>
          )}
        </div>
      </div>

      <div className="pt-6 border-t flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Reglas
        </Button>
      </div>
    </form>
    <div className="mt-8">
      <ForceGenerateButton />
    </div>
    </div>
  );
}
