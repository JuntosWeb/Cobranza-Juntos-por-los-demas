import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Printer } from 'lucide-react';

const prisma = new PrismaClient();

export default async function TicketPage({ params }: { params: { id: string } }) {
  const payment = await prisma.payment.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      chargeAllocations: {
        include: { charge: true }
      }
    }
  });

  if (!payment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 print:bg-white print:py-0">
      
      {/* Botón de impresión (oculto al imprimir) */}
      <div className="mb-6 print:hidden">
        <button 
          // @ts-ignore - onclick is client side, so we use a simple script or just make a client component if needed. Actually we can't use onClick in server component.
          // But we can add a small script tag.
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
        >
          <Printer className="w-5 h-5" />
          Imprimir Recibo
        </button>
        <script dangerouslySetInnerHTML={{ __html: `document.querySelector('button').addEventListener('click', () => window.print())` }} />
      </div>

      {/* Contenedor del Ticket */}
      <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0 text-slate-800">
        
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
            <span className="uppercase">{payment.recordedBy.split('@')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Método:</span>
            <span>{payment.paymentMethod}</span>
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
            <div className="flex justify-between">
              <span>Caja Rápida / Valoración</span>
              <span>${payment.totalBaseAmount.toFixed(2)}</span>
            </div>
          ) : (
            <div className="space-y-1">
              {payment.chargeAllocations.map(ca => (
                <div key={ca.id} className="flex justify-between">
                  <span>Mes {ca.charge.periodMonth}/{ca.charge.periodYear}</span>
                  <span>${ca.amountAllocated.toFixed(2)}</span>
                </div>
              ))}
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
