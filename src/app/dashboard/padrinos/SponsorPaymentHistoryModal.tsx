"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { cancelSponsorPayment } from '@/lib/actions/sponsor.actions';

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
  sponsor: any;
};

export function SponsorPaymentHistoryModal({ isOpen, onClose, sponsor }: Props) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelPayment = async (paymentId: string) => {
    if (!confirm('¿Estás seguro de anular este pago del padrino? El pago quedará registrado como CANCELADO.')) return;
    
    setCancellingId(paymentId);
    const res = await cancelSponsorPayment(paymentId);
    setCancellingId(null);
    
    if (res.success) {
      alert('Pago anulado exitosamente');
      onClose();
    } else {
      alert(res.error || 'Error al anular pago');
    }
  };

  const recentPayments = sponsor.sponsorPayments?.slice(0, 5) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de Pagos - {sponsor.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {recentPayments.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No hay pagos registrados para este padrino.</p>
          ) : (
            recentPayments.map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 border rounded-xl">
                <div>
                  <p className="font-bold text-lg">
                    ${payment.amount.toFixed(2)}
                    {payment.status === 'CANCELLED' && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">ANULADO</span>}
                  </p>
                  <p className="text-sm text-slate-600">
                    {format(new Date(payment.paymentDate), 'dd MMM yyyy')} - {methodEs[payment.paymentMethod] || payment.paymentMethod}
                  </p>
                  {payment.periodCovered && (
                    <p className="text-xs text-slate-500">
                      Periodo: {payment.periodCovered}
                    </p>
                  )}
                  {payment.notes && (
                    <p className="text-xs text-slate-500 italic">
                      "{payment.notes}"
                    </p>
                  )}
                </div>
                
                {payment.status !== 'CANCELLED' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleCancelPayment(payment.id)}
                    disabled={cancellingId === payment.id}
                    title="Anular Pago"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
