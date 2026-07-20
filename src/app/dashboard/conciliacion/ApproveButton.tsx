"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { approveTransfer } from '@/lib/actions/payment.actions';

export function ApproveButton({ paymentId }: { paymentId: string }) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    const res = await approveTransfer(paymentId);
    setIsApproving(false);
    if (!res.success) {
      alert(res.error);
    }
  };

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleApprove}
      disabled={isApproving}
      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
    >
      {isApproving ? 'Aprobando...' : 'Aprobar'}
    </Button>
  );
}
