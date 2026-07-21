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
  patient: any; // Type from getPatientsWithPaymentStatus
  groupedServices: any;
  patientCategories?: string[];
};

export function EditPatientModal({ patient, groupedServices, patientCategories }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Find the exact priceId based on the patient's current service
  const currentServiceGroup = groupedServices[patient.serviceName] || [];
  const currentPriceObj = currentServiceGroup.find((p: any) => p.frequency === patient.frequency && p.scheduleType === patient.scheduleType);

  const initialData = {
    id: patient.id,
    folio: patient.folio,
    fullName: patient.fullName,
    category: patient.category,
    serviceName: patient.serviceName,
    priceId: currentPriceObj?.id || '',
    agreedPrice: patient.baseAmount,
    status: patient.status,
    suspensionReason: patient.suspensionReason
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        <div className="mt-4">
          <PatientForm 
            groupedServices={groupedServices} 
            patientCategories={patientCategories}
            initialData={initialData} 
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
