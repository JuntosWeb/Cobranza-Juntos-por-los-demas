"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { approveTransfer, rejectTransfer } from '@/lib/actions/payment.actions';

export function ConciliationActions({ paymentId, type }: { paymentId: string; type: 'PATIENT' | 'SPONSOR' }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm('¿Confirmas que el dinero ya está en el banco?')) return;
    setIsLoading(true);
    const res = await approveTransfer(paymentId, type);
    setIsLoading(false);
    if (!res.success) alert(res.error);
  };

  const handleReject = async () => {
    if (!confirm('¿Estás seguro de rechazar este pago? Esto regresará las mensualidades del paciente a PENDIENTE para que se le vuelvan a cobrar.')) return;
    setIsLoading(true);
    const res = await rejectTransfer(paymentId, type);
    setIsLoading(false);
    if (!res.success) alert(res.error);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="outline"
        size="sm"
        onClick={handleReject}
        disabled={isLoading}
        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
      >
        {isLoading ? '...' : 'Rechazar'}
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={handleApprove}
        disabled={isLoading}
        className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
      >
        {isLoading ? 'Aprobando...' : 'Aprobar'}
      </Button>
    </div>
  );
}
