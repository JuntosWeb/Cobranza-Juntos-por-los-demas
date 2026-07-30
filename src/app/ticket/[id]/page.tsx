import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PrintButton } from './PrintButton';
import { EditableConcept } from './EditableConcept';

export default async function TicketPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const payment = await prisma.payment.findUnique({
    where: { id: resolvedParams.id },
    include: {
      patient: {
        include: {
          services: {
            include: {
              service: true
            }
          }
        }
      },
      chargeAllocations: {
        include: { charge: true }
      }
    }
  });

  if (!payment) {
    notFound();
  }

  // Fetch the actual user name if recordedBy is a username
  const recordedUser = await prisma.user.findFirst({
    where: { username: payment.recordedBy }
  });
  const userNameDisplay = recordedUser ? recordedUser.name : payment.recordedBy.split('@')[0];

  const methodEs: Record<string, string> = {
    CASH: 'Efectivo',
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
    TC: 'Tarjeta / Plataforma',
    DEPOSITO: 'Depósito',
    ESPECIE: 'Especie'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 print:bg-white print:py-0">
      
      {/* Botón de impresión (oculto al imprimir) */}
      <div className="mb-6 print:hidden">
        <PrintButton />
      </div>

      {/* Contenedor del Ticket */}
      <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0 text-slate-800 print:text-black">
        
        <div className="text-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-jpld.png" alt="Juntos por los Demás" className="h-16 mx-auto mb-2 object-contain grayscale print:grayscale-0" />
          <h1 className="font-bold text-xl uppercase tracking-widest">Fundación JPLD</h1>
          <p className="text-sm text-slate-500">Comprobante de Pago</p>
        </div>

        <div className="space-y-2 text-sm border-b pb-4 mb-4 border-slate-200 border-dashed">
          <div className="flex justify-between">
            <span className="font-medium">Folio Transacción:</span>
            <span>{payment.receiptNumber || payment.id.slice(-6).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Fecha:</span>
            <span>{format(payment.paymentDate, "dd/MM/yyyy HH:mm")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Le Atendió:</span>
            <span className="uppercase">{userNameDisplay}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Método:</span>
            <span>{methodEs[payment.paymentMethod] || payment.paymentMethod}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold mb-1">Cliente:</p>
          <p className="text-sm uppercase">
            {payment.isQuickPayment ? payment.quickPaymentName : payment.patient?.fullName}
          </p>
          {payment.patient?.folio && (
            <p className="text-xs text-slate-500">Expediente: {payment.patient.folio}</p>
          )}
        </div>

        <div className="border-b pb-4 mb-4 border-slate-200 border-dashed text-sm">
          <p className="font-bold mb-2">Conceptos Pagados:</p>
          {payment.isQuickPayment ? (
            <div className="flex justify-between gap-4">
              <EditableConcept initialValue={payment.quickPaymentNotes || 'Caja Rápida / Valoración'} />
              <span className="shrink-0">${payment.totalBaseAmount.toFixed(2)}</span>
            </div>
          ) : (
            <div className="space-y-1">
              {payment.chargeAllocations.map(ca => {
                const isMonthly = !ca.charge.concept;
                const periodStr = `Mes ${ca.charge.periodMonth}/${ca.charge.periodYear}`;
                const therapies = payment.patient?.services.map(s => s.service?.name).filter(Boolean).join(' + ');
                const conceptName = isMonthly ? (therapies ? `${periodStr} - ${therapies}` : periodStr) : (ca.charge.concept || 'Cargo Extra');
                
                return (
                  <div key={ca.id} className="flex flex-col">
                    <div className="flex justify-between gap-4">
                      <EditableConcept initialValue={conceptName} />
                      <span className="shrink-0">${ca.charge.baseAmount.toFixed(2)}</span>
                    </div>
                    {ca.charge.lateFee > 0 && (
                      <div className="flex justify-between text-slate-500 mt-1">
                        <span>Otros cargos (Morosidad)</span>
                        <span>${ca.charge.lateFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {payment.quarterlyDiscount > 0 && (
            <div className="flex justify-between text-slate-500 mt-1">
              <span>Descuento Trimestral</span>
              <span>-${payment.quarterlyDiscount.toFixed(2)}</span>
            </div>
          )}
          {payment.customDiscount > 0 && (
            <div className="flex justify-between text-slate-500 mt-1">
              <span>Desc. Dirección</span>
              <span>-${payment.customDiscount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center font-black text-2xl mb-8">
          <span>TOTAL</span>
          <span>${payment.finalAmountPaid.toFixed(2)}</span>
        </div>

        <div className="text-center text-xs text-slate-500">
          <p>¡Gracias por tu aportación!</p>
          <p>Juntos por los Demás A.C.</p>
          <p className="mt-4">Este recibo no tiene validez fiscal.</p>
        </div>
      </div>
    </div>
  );
}
