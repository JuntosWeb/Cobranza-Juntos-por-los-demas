"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { approveTransfer } from '@/lib/actions/payment.actions';

export function ApproveButton({ paymentId, type }: { paymentId: string; type: 'PATIENT' | 'SPONSOR' }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm('¿Confirmas que el dinero ya está en el banco?')) return;
    setIsLoading(true);
    const res = await approveTransfer(paymentId, type);
    setIsLoading(false);
    if (!res.success) alert(res.error);
  };

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleApprove}
      disabled={isLoading}
      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
    >
      {isLoading ? 'Aprobando...' : 'Aprobar'}
    </Button>
  );
}
