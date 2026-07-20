"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentModal } from '@/components/cobranza/PaymentModal';
import { Charge } from '@prisma/client';

type PendingCharge = Charge & { calculatedLateFee: number };

type PatientData = {
  id: string;
  fullName: string;
  pendingCharges: PendingCharge[];
};

type Props = {
  patient: PatientData;
  disabled?: boolean;
  recordedBy: string;
};

export function CobrarButton({ patient, disabled, recordedBy }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="default" 
        size="sm" 
        disabled={disabled || patient.pendingCharges.length === 0}
        onClick={() => setIsModalOpen(true)}
      >
        Cobrar
      </Button>
      {isModalOpen && (
        <PaymentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          patientId={patient.id}
          patientName={patient.fullName}
          pendingCharges={patient.pendingCharges}
          recordedBy={recordedBy}
        />
      )}
    </>
  );
}
