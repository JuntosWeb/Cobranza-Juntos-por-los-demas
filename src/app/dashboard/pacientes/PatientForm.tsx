"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createPatient, updatePatient } from '@/lib/actions/patient.actions';
import { getAllSponsors } from '@/lib/actions/sponsor-helpers.actions';

type ServicePriceData = {
  id: string;
  serviceId: string;
  frequency: number;
  scheduleType: string;
  monthlyPrice: number;
  service: {
    id: string;
    name: string;
  }
};

type Props = {
  groupedServices: Record<string, ServicePriceData[]>;
  patientCategories?: string[];
  initialData?: {
    id: string;
    folio: string | null;
    fullName: string;
    category: string;
    serviceName: string;
    priceId: string;
    agreedPrice: number;
    sponsorId?: string | null;
    status?: string;
    suspensionReason?: string | null;
  };
  onSuccess?: () => void;
};

export function PatientForm({ groupedServices, patientCategories = ['PARTICULAR', 'FUNDACION'], initialData, onSuccess }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sponsors, setSponsors] = useState<{id: string, name: string, folio: string | null}[]>([]);
  
  useEffect(() => {
    getAllSponsors().then(setSponsors);
  }, []);

  const [folio, setFolio] = useState(initialData?.folio || '');
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [category, setCategory] = useState<string>(initialData?.category || patientCategories[0] || 'PARTICULAR');
  const [chargeInscription, setChargeInscription] = useState(true);
  const [selectedServiceName, setSelectedServiceName] = useState<string>(initialData?.serviceName || '');
  const [selectedPriceId, setSelectedPriceId] = useState<string>(initialData?.priceId || '');
  const [customPrice, setCustomPrice] = useState<number | ''>(initialData?.agreedPrice || '');
  const [sponsorId, setSponsorId] = useState<string>(initialData?.sponsorId || 'none');
  const [status, setStatus] = useState<string>(initialData?.status || 'ACTIVE');
  const [suspensionReason, setSuspensionReason] = useState<string>(initialData?.suspensionReason || '');

  const currentServiceOptions = selectedServiceName ? groupedServices[selectedServiceName] : [];
  const selectedPriceObj = currentServiceOptions?.find(p => p.id === selectedPriceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPriceObj) return;

    setIsSubmitting(true);
    
    const finalPrice = customPrice !== '' ? Number(customPrice) : selectedPriceObj.monthlyPrice;

    const dataToSave = {
      folio: folio.trim() || undefined,
      fullName,
      category,
      serviceId: selectedPriceObj.serviceId,
      frequency: selectedPriceObj.frequency,
      scheduleType: selectedPriceObj.scheduleType,
      agreedPrice: finalPrice,
      sponsorId: sponsorId !== 'none' ? sponsorId : null,
      chargeInscription,
      status: status as any,
      suspensionReason
    };

    let res;
    if (initialData) {
      res = await updatePatient(initialData.id, dataToSave);
    } else {
      res = await createPatient(dataToSave);
    }

    setIsSubmitting(false);
    if (res.success) {
      alert(initialData ? 'Paciente actualizado con éxito' : 'Paciente creado con éxito');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/cobranza');
      }
    } else {
      alert(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="folio">Folio / Expediente (Opcional)</Label>
          <Input id="folio" value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="Ej. F/1234" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select 
            value={category} 
            onValueChange={(v) => setCategory(v || '')}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {patientCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {initialData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado del Paciente</Label>
            <Select 
              value={status} 
              onValueChange={(v) => setStatus(v || 'ACTIVE')}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                <SelectItem value="INACTIVE">Baja Definitiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(status === 'SUSPENDED' || status === 'INACTIVE') && (
            <div className="space-y-2">
              <Label htmlFor="suspensionReason">Motivo de la Baja/Suspensión</Label>
              <Input 
                id="suspensionReason" 
                value={suspensionReason} 
                onChange={(e) => setSuspensionReason(e.target.value)} 
                placeholder="Ej. Fuego incosteable, cambio de ciudad..."
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre Completo del Paciente</Label>
        <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ej. Juan Pérez López" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sponsor">Padrino Asignado</Label>
        <Select 
          value={sponsorId} 
          onValueChange={(v) => setSponsorId(v || 'none')}
          items={{
            'none': '-- Sin Padrino --',
            ...Object.fromEntries(sponsors.map(sp => [sp.id, `${sp.folio ? `${sp.folio} - ` : ''}${sp.name}`]))
          }}
        >
          <SelectTrigger><SelectValue placeholder="Seleccionar Padrino (Opcional)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-- Sin Padrino --</SelectItem>
            {sponsors.map(sp => (
              <SelectItem key={sp.id} value={sp.id}>
                {sp.folio ? `${sp.folio} - ` : ''}{sp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-2">
          <Label>Servicio a Inscribir</Label>
          <Select 
            value={selectedServiceName} 
            onValueChange={(v) => { 
              setSelectedServiceName(v as string);
              setSelectedPriceId('');
              setCustomPrice('');
            }}
            items={Object.fromEntries(Object.keys(groupedServices).map(name => [name, name]))}
          >
            <SelectTrigger><SelectValue placeholder="Selecciona Servicio" /></SelectTrigger>
            <SelectContent>
              {Object.keys(groupedServices).map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Frecuencia y Horario</Label>
          <Select 
            value={selectedPriceId} 
            onValueChange={(v) => {
              setSelectedPriceId(v as string);
              setCustomPrice('');
            }}
            disabled={!selectedServiceName}
            items={Object.fromEntries((currentServiceOptions || []).map(sp => [sp.id, `${sp.frequency}x sem - Horario ${sp.scheduleType} ($${sp.monthlyPrice})`]))}
          >
            <SelectTrigger><SelectValue placeholder="Selecciona modalidad" /></SelectTrigger>
            <SelectContent>
              {currentServiceOptions?.map(sp => (
                <SelectItem key={sp.id} value={sp.id}>
                  {sp.frequency}x sem - Horario {sp.scheduleType} (${sp.monthlyPrice})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPriceObj && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-900">Tarifa Base Sugerida:</span>
            <span className="text-xl font-bold text-blue-900">${selectedPriceObj.monthlyPrice}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customPrice" className="text-blue-800">Precio Especial Pactado (solo si aplica descuento de dirección)</Label>
            <Input 
              id="customPrice"
              type="number"
              min="0"
              placeholder={`Dejar en blanco para usar $${selectedPriceObj.monthlyPrice}`}
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <p className="text-xs text-blue-600">
              El precio que dejes aquí será la base para todos los cobros mensuales futuros.
            </p>
          </div>
        </div>
      )}

      {!initialData && (
        <div className="flex flex-col space-y-2 p-4 bg-slate-50 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="chargeInscription"
              checked={chargeInscription}
              onCheckedChange={(c) => setChargeInscription(c as boolean)}
            />
            <Label htmlFor="chargeInscription" className="font-medium">
              Generar cobro de inscripción inicial
            </Label>
          </div>
          <p className="text-xs text-slate-500 pl-6">
            Se generará automáticamente un recibo pendiente por el concepto de "Inscripción Anual" usando la cuota base configurada.
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting || !selectedPriceId}>
        {isSubmitting ? (initialData ? 'Actualizando...' : 'Registrando...') : (initialData ? 'Guardar Cambios' : 'Registrar Paciente')}
      </Button>
    </form>
  );
}
