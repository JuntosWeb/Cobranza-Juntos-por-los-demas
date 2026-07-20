"use server";

import { PrismaClient, PaymentMethod } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type RegisterPaymentInput = {
  patientId?: string;
  chargeIds?: string[];
  totalBaseAmount: number;
  totalLateFee?: number;
  quarterlyDiscount?: number;
  customDiscount?: number;
  customDiscountReason?: string;
  finalAmountPaid: number;
  paymentMethod: PaymentMethod;
  recordedBy: string;
  isQuickPayment?: boolean;
  quickPaymentName?: string;
  quickPaymentNotes?: string;
};

export async function registerPayment(data: RegisterPaymentInput) {
  try {
    // Si es un pago rápido (valoración sin paciente)
    if (data.isQuickPayment) {
      const receiptNumber = `N${Math.floor(10000 + Math.random() * 90000)}`;
      const newPayment = await prisma.payment.create({
        data: {
          totalBaseAmount: data.totalBaseAmount,
          finalAmountPaid: data.totalBaseAmount,
          paymentMethod: data.paymentMethod,
          recordedBy: data.recordedBy,
          isQuickPayment: true,
          quickPaymentName: data.quickPaymentName,
          quickPaymentNotes: data.quickPaymentNotes,
          receiptNumber,
          status: data.paymentMethod === 'TRANSFER' ? 'PENDING' : 'COMPLETED',
        }
      });
      revalidatePath('/dashboard/caja-rapida');
      revalidatePath('/dashboard/reportes');
      return { success: true, payment: newPayment };
    }

    // Pago de paciente normal
    if (!data.patientId || !data.chargeIds || data.chargeIds.length === 0) {
      return { success: false, error: 'Datos incompletos para procesar el pago' };
    }

    // Creamos la transacción del pago, relacionando con PaymentCharge y actualizando los Charges a PAID
    const newPayment = await prisma.$transaction(async (tx) => {
      // 1. Crear el registro de Payment
      const payment = await tx.payment.create({
        data: {
          patientId: data.patientId,
          totalBaseAmount: data.totalBaseAmount,
          totalLateFee: data.totalLateFee || 0,
          quarterlyDiscount: data.quarterlyDiscount || 0,
          customDiscount: data.customDiscount || 0,
          customDiscountReason: data.customDiscountReason,
          finalAmountPaid: data.finalAmountPaid,
          paymentMethod: data.paymentMethod,
          recordedBy: data.recordedBy,
          status: data.paymentMethod === 'TRANSFER' ? 'PENDING' : 'COMPLETED',
        }
      });

      // 2. Crear las relaciones en PaymentCharge y actualizar los Charges a PAID
      for (const chargeId of data.chargeIds!) {
        // En un MVP asumimos que el cargo se liquida completo.
        // Si quisiéramos pagos parciales, habría que calcular cuánto de amountAllocated se va a cada charge
        // y si el Charge queda PAID o PENDING (con adeudo restante). Para mantenerlo simple, lo liquidamos.
        const charge = await tx.charge.update({
          where: { id: chargeId },
          data: { status: 'PAID' }
        });

        await tx.paymentCharge.create({
          data: {
            paymentId: payment.id,
            chargeId: charge.id,
            amountAllocated: charge.baseAmount + charge.lateFee
          }
        });
      }

      return payment;
    });

    revalidatePath('/dashboard/cobranza');
    revalidatePath('/dashboard/reportes');
    
    return { success: true, payment: newPayment };
  } catch (error: any) {
    console.error('Error registrando pago:', error);
    return { success: false, error: 'Ocurrió un error al registrar el pago' };
  }
}

export async function getPendingTransfers() {
  return prisma.payment.findMany({
    where: { status: 'PENDING', paymentMethod: 'TRANSFER' },
    include: { 
      patient: true,
      chargeAllocations: {
        include: { charge: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function approveTransfer(paymentId: string) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'COMPLETED' }
    });
    revalidatePath('/dashboard/conciliacion');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al aprobar la transferencia' };
  }
}
