"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { upsertSponsor } from '@/lib/actions/sponsor.actions';
import { getAllActivePatients } from '@/lib/actions/patient-helpers.actions';
import ReactSelect from 'react-select';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  sponsor?: any;
};

export function SponsorModal({ isOpen, onClose, sponsor }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientsOptions, setPatientsOptions] = useState<{value: string, label: string}[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    async function load() {
      const pts = await getAllActivePatients();
      setPatientsOptions(pts.map(p => ({
        value: p.id,
        label: p.folio ? `${p.folio} - ${p.fullName}` : p.fullName
      })));
    }
    load();
    if (sponsor?.patients) {
      setSelectedPatients(sponsor.patients.map((p: any) => ({
        value: p.id,
        label: p.folio ? `${p.folio} - ${p.fullName}` : p.fullName
      })));
    }
  }, [sponsor]);
  
  const [formData, setFormData] = useState({
    folio: sponsor?.folio || '',
    name: sponsor?.name || '',
    monthlyCommitment: sponsor?.monthlyCommitment?.toString() || '0',
    periodicity: sponsor?.periodicity || 'MENSUAL',
    whatsapp: sponsor?.whatsapp || '',
    billingData: sponsor?.billingData || '',
    billingContactName: sponsor?.billingContactName || '',
    billingContactEmail: sponsor?.billingContactEmail || '',
    approxPaymentDate: sponsor?.approxPaymentDate || '',
    comments: sponsor?.comments || '',
    birthday: sponsor?.birthday ? new Date(sponsor.birthday).toISOString().split('T')[0] : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await upsertSponsor({
      id: sponsor?.id,
      folio: formData.folio,
      name: formData.name,
      monthlyCommitment: Number(formData.monthlyCommitment),
      periodicity: formData.periodicity,
      whatsapp: formData.whatsapp,
      billingData: formData.billingData,
      billingContactName: formData.billingContactName,
      billingContactEmail: formData.billingContactEmail,
      approxPaymentDate: formData.approxPaymentDate,
      comments: formData.comments,
      birthday: formData.birthday ? new Date(formData.birthday) : undefined,
      patientIds: selectedPatients.map(p => p.value)
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{sponsor ? 'Editar Padrino' : 'Nuevo Padrino'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Folio Padrino</Label>
              <Input 
                value={formData.folio} 
                onChange={e => setFormData({ ...formData, folio: e.target.value })}
                placeholder="Ej. P3"
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre Padrino / Empresa</Label>
              <Input 
                required
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Aportación ($ Mensual)</Label>
              <Input 
                type="number"
                required
                min="0"
                value={formData.monthlyCommitment} 
                onChange={e => setFormData({ ...formData, monthlyCommitment: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Periodicidad</Label>
              <Select 
                value={formData.periodicity} 
                onValueChange={v => setFormData({ ...formData, periodicity: v as string })}
                items={{
                  MENSUAL: 'Mensual',
                  TRIMESTRAL: 'Trimestral',
                  SEMESTRAL: 'Semestral',
                  ANUAL: 'Anual',
                  UNICA_VEZ: 'Única Vez'
                }}
              >
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MENSUAL">Mensual</SelectItem>
                  <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                  <SelectItem value="SEMESTRAL">Semestral</SelectItem>
                  <SelectItem value="ANUAL">Anual</SelectItem>
                  <SelectItem value="UNICA_VEZ">Única Vez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp Padrino</Label>
              <Input 
                value={formData.whatsapp} 
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre Cobranza (Contacto)</Label>
              <Input 
                value={formData.billingContactName} 
                onChange={e => setFormData({ ...formData, billingContactName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp/Correo Cobranza</Label>
              <Input 
                value={formData.billingContactEmail} 
                onChange={e => setFormData({ ...formData, billingContactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Datos para Recibo / Factura</Label>
              <Input 
                value={formData.billingData} 
                onChange={e => setFormData({ ...formData, billingData: e.target.value })}
                placeholder="RFC, Domicilio..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Aprox. Pago</Label>
              <Input 
                value={formData.approxPaymentDate} 
                onChange={e => setFormData({ ...formData, approxPaymentDate: e.target.value })}
                placeholder="Ej. 1RA QUINCENA"
              />
            </div>
            <div className="space-y-2">
              <Label>Cumpleaños</Label>
              <Input 
                type="date"
                value={formData.birthday} 
                onChange={e => setFormData({ ...formData, birthday: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comentarios</Label>
            <Input 
              value={formData.comments} 
              onChange={e => setFormData({ ...formData, comments: e.target.value })}
              placeholder="VIP, mandar correo, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Ahijados (Pacientes)</Label>
            <ReactSelect
              isMulti
              options={patientsOptions}
              value={selectedPatients}
              onChange={(v) => setSelectedPatients(v as any)}
              placeholder="Buscar y seleccionar pacientes..."
              className="text-sm"
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 })
              }}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
