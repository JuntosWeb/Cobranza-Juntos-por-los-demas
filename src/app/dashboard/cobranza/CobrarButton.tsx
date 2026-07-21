"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentModal } from '@/components/cobranza/PaymentModal';
import { PaymentHistoryModal } from '@/components/cobranza/PaymentHistoryModal';
import { Charge } from '@prisma/client';
import { History } from 'lucide-react';

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsHistoryOpen(true)}
        title="Historial de Pagos"
        className="text-slate-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
      >
        <History className="w-4 h-4" />
      </Button>
      <Button 
        variant="default" 
        size="sm" 
        disabled={disabled || patient.pendingCharges.length === 0}
        onClick={() => setIsModalOpen(true)}
        className="shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 font-semibold"
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
      {isHistoryOpen && (
        <PaymentHistoryModal 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          patientId={patient.id}
          patientName={patient.fullName}
        />
      )}
    </div>
  );
}
