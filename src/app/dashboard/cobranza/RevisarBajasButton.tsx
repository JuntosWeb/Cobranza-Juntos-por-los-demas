"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BajasModal } from '@/components/cobranza/BajasModal';
import { AlertCircle } from 'lucide-react';

type SuspendablePatient = {
  id: string;
  folio: string | null;
  fullName: string;
  lastPaymentDate?: Date;
};

type Props = {
  suspendablePatients: SuspendablePatient[];
};

export function RevisarBajasButton({ suspendablePatients }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const count = suspendablePatients.length;

  if (count === 0) return null;

  return (
    <>
      <Button 
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 animate-pulse"
      >
        <AlertCircle className="w-4 h-4" />
        Revisar Bajas ({count})
      </Button>
      <BajasModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        suspendablePatients={suspendablePatients}
      />
    </>
  );
}
