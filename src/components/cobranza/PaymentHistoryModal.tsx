"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getPatientRecentPayments, rejectTransfer } from '@/lib/actions/payment.actions';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

const methodEs: Record<string, string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  TC: 'Tarjeta / Plataforma',
  DEPOSITO: 'Depósito',
  ESPECIE: 'Especie'
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
};

export function PaymentHistoryModal({ isOpen, onClose, patientId, patientName }: Props) {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadPayments = async () => {
    setIsLoading(true);
    const data = await getPatientRecentPayments(patientId);
    setPayments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) loadPayments();
  }, [isOpen, patientId]);

  const handleCancel = async (paymentId: string) => {
    if (!confirm('¿Estás seguro de anular este pago? Los cargos asociados regresarán a estado PENDIENTE.')) return;
    
    setCancellingId(paymentId);
    const res = await rejectTransfer(paymentId, 'PATIENT');
    setCancellingId(null);
    
    if (res.success) {
      alert('Pago anulado exitosamente');
      loadPayments(); // Reload list
    } else {
      alert(res.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historial de Pagos - {patientName}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <p className="text-sm text-slate-500">Cargando pagos...</p>
          ) : payments.length === 0 ? (
            <p className="text-sm text-slate-500">No hay pagos recientes registrados para este paciente.</p>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 border rounded-lg">
                  <div>
                    <p className="font-bold">${payment.finalAmountPaid.toFixed(2)} - {methodEs[payment.paymentMethod] || payment.paymentMethod}</p>
                    <p className="text-xs text-slate-500">Fecha: {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm')} | Status: {payment.status}</p>
                    <p className="text-xs text-slate-500">Folio: {payment.receiptNumber || payment.id.slice(-6).toUpperCase()}</p>
                    {payment.chargeAllocations?.length > 0 && (
                      <div className="mt-1 text-xs text-blue-600">
                        Meses cubiertos: {payment.chargeAllocations.map((ca: any) => `${ca.charge.periodMonth}/${ca.charge.periodYear}`).join(', ')}
                      </div>
                    )}
                  </div>
                  <div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleCancel(payment.id)}
                      disabled={cancellingId === payment.id}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {cancellingId === payment.id ? 'Anulando...' : 'Anular Pago'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
