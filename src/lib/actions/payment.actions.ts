"use server";

import { PaymentMethod } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';



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
    // si es un cobro rapido sin paciente registrado
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

    // aqui cobramos a un paciente que si esta en la base de datos
    if (!data.patientId || !data.chargeIds || data.chargeIds.length === 0) {
      return { success: false, error: 'Datos incompletos para procesar el pago' };
    }

    if (data.finalAmountPaid < 0 || isNaN(data.finalAmountPaid)) {
      return { success: false, error: 'El monto de pago es inválido.' };
    }

    // Lógica para obtener el número de recibo consecutivo
    let receiptNumber = '';
    if (data.isQuickPayment) {
      receiptNumber = `N${Math.floor(10000 + Math.random() * 90000)}`;
    } else {
      const lastPayment = await prisma.payment.findFirst({
        where: { receiptNumber: { startsWith: 'REC-' } },
        orderBy: { createdAt: 'desc' }
      });
      let nextId = 1;
      if (lastPayment && lastPayment.receiptNumber) {
        const match = lastPayment.receiptNumber.match(/REC-(\d+)/);
        if (match && match[1]) {
          nextId = parseInt(match[1], 10) + 1;
        }
      }
      receiptNumber = `REC-${nextId.toString().padStart(4, '0')}`;
    }

    // guardamos el pago y ponemos los cargos como pagados en la base de datos
    const newPayment = await prisma.$transaction(async (tx) => {
      // paso 1: guardar el pago
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
          receiptNumber,
          status: data.paymentMethod === 'TRANSFER' ? 'PENDING' : 'COMPLETED',
        }
      });

      // paso 2: enlazar los cargos y actualizarlos
      for (const chargeId of data.chargeIds!) {
        // Verificamos que no se cobre doble si presionan el botón varias veces
        const updateResult = await tx.charge.updateMany({
          where: { id: chargeId, status: 'PENDING' },
          data: { status: 'PAID' }
        });

        if (updateResult.count === 0) {
          throw new Error('El cargo ya fue pagado en otra sesión. Transacción abortada para prevenir cobro doble.');
        }

        // sacamos la info del cargo de la base
        const charge = await tx.charge.findUniqueOrThrow({
          where: { id: chargeId }
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
  const patientTransfers = await prisma.payment.findMany({
    where: { status: 'PENDING', paymentMethod: 'TRANSFER' },
    include: { 
      patient: true,
      chargeAllocations: {
        include: { charge: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const sponsorTransfers = await prisma.sponsorPayment.findMany({
    where: { status: 'PENDING', paymentMethod: 'TRANSFER' },
    include: { sponsor: true },
    orderBy: { createdAt: 'desc' }
  });

  return {
    patientTransfers,
    sponsorTransfers
  };
}

export async function approveTransfer(paymentId: string, type: 'PATIENT' | 'SPONSOR') {
  try {
    if (type === 'PATIENT') {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' }
      });
    } else {
      await prisma.sponsorPayment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' }
      });
    }
    revalidatePath('/dashboard/conciliacion');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al aprobar la transferencia' };
  }
}

export async function rejectTransfer(paymentId: string, type: 'PATIENT' | 'SPONSOR') {
  try {
    if (type === 'PATIENT') {
      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { id: paymentId },
          data: { status: 'CANCELLED' },
          include: { chargeAllocations: true }
        });

        const chargeIds = payment.chargeAllocations.map(ca => ca.chargeId);
        
        if (chargeIds.length > 0) {
          await tx.charge.updateMany({
            where: { id: { in: chargeIds } },
            data: { status: 'PENDING' }
          });
        }
      });
    } else {
      await prisma.sponsorPayment.update({
        where: { id: paymentId },
        data: { status: 'CANCELLED' }
      });
    }
    revalidatePath('/dashboard/conciliacion');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al rechazar la transferencia' };
  }
}

export async function registerExpense(concept: string, amount: number, notes: string, recordedBy: string) {
  try {
    await prisma.expense.create({
      data: { concept, amount, notes, recordedBy }
    });
    revalidatePath('/dashboard/caja-rapida');
    revalidatePath('/dashboard/reportes');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al registrar gasto' };
  }
}

export async function cancelExpense(expenseId: string) {
  try {
    await prisma.expense.delete({
      where: { id: expenseId }
    });
    revalidatePath('/dashboard/caja-rapida');
    revalidatePath('/dashboard/reportes');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al cancelar gasto' };
  }
}

export async function getPaymentsForBilling() {
  return prisma.sponsorPayment.findMany({
    where: { 
      OR: [
        { cfdiUse: { not: null } },
        { sponsor: { billingData: { not: null } } }
      ],
      status: 'COMPLETED'
    },
    include: { sponsor: true },
    orderBy: { paymentDate: 'desc' },
    take: 100
  });
}

export async function getPatientRecentPayments(patientId: string) {
  return prisma.payment.findMany({
    where: { patientId, status: { in: ['COMPLETED', 'PENDING'] } },
    include: {
      chargeAllocations: {
        include: { charge: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
}
