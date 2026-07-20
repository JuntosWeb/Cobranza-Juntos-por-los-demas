"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { PatientForm } from '@/app/dashboard/pacientes/PatientForm';

type ServicePriceData = {
  id: string;
  serviceId: string;
  frequency: number;
  scheduleType: string;
  monthlyPrice: number;
  service: { id: string; name: string; }
};

type Props = {
  patient: any; // The patient object from the table
  groupedServices: Record<string, ServicePriceData[]>;
};

export function EditPatientModal({ patient, groupedServices }: Props) {
  const [open, setOpen] = useState(false);

  // Find the exact priceId based on the patient's current service
  const currentServiceGroup = groupedServices[patient.serviceName] || [];
  const currentPriceObj = currentServiceGroup.find(p => p.frequency === patient.frequency && p.scheduleType === patient.scheduleType);

  const initialData = {
    id: patient.id,
    folio: patient.folio,
    fullName: patient.fullName,
    category: patient.category as 'PARTICULAR' | 'FUNDACION',
    serviceName: patient.serviceName,
    priceId: currentPriceObj?.id || '',
    agreedPrice: patient.baseAmount
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="ml-2">
            <Edit className="w-4 h-4" />
          </Button>
        }
      />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        <PatientForm 
          groupedServices={groupedServices} 
          initialData={initialData} 
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
