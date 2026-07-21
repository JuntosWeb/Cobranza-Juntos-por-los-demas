"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';



export async function getSponsors() {
  return prisma.sponsor.findMany({
    include: {
      patients: {
        include: {
          services: { include: { service: true } }
        }
      },
      sponsorPayments: {
        orderBy: { paymentDate: 'desc' }
      }
    },
    orderBy: { name: 'asc' }
  });
}

type SponsorInput = {
  id?: string;
  folio?: string;
  name: string;
  monthlyCommitment: number;
  billingData?: string;
  comments?: string;
  birthday?: Date;
  contributionMethod?: string;
  periodicity: string;
  whatsapp?: string;
  billingContactName?: string;
  billingContactEmail?: string;
  approxPaymentDate?: string;
  patientIds?: string[];
};

export async function upsertSponsor(data: SponsorInput) {
  try {
    const { patientIds, ...sponsorData } = data;
    if (data.id) {
      await prisma.sponsor.update({
        where: { id: data.id },
        data: {
          ...sponsorData,
          patients: {
            set: patientIds?.map(id => ({ id })) || []
          }
        }
      });
    } else {
      await prisma.sponsor.create({
        data: {
          ...sponsorData,
          patients: {
            connect: patientIds?.map(id => ({ id })) || []
          }
        }
      });
    }
    revalidatePath('/dashboard/padrinos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

type SponsorPaymentInput = {
  sponsorId: string;
  amount: number;
  commission: number;
  paymentDate: Date;
  paymentMethod: string;
  receiptNumber?: string;
  authorizationCode?: string;
  periodCovered?: string;
  cfdiUse?: string;
  notes?: string;
};

export async function registerSponsorPayment(data: SponsorPaymentInput) {
  try {
    await prisma.sponsorPayment.create({
      data
    });
    revalidatePath('/dashboard/padrinos');
    revalidatePath('/dashboard/reportes');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function cancelSponsorPayment(paymentId: string) {
  try {
    await prisma.sponsorPayment.update({
      where: { id: paymentId },
      data: { status: 'CANCELLED' }
    });
    revalidatePath('/dashboard/padrinos');
    revalidatePath('/dashboard/reportes');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Error al anular el pago del padrino' };
  }
}

export async function getDelayedSponsors() {
  const sponsors = await prisma.sponsor.findMany({
    include: { sponsorPayments: { where: { status: 'COMPLETED' } } }
  });
  
  const now = new Date();
  const delayed = sponsors.map(s => {
    const monthsSinceReg = (now.getFullYear() - s.createdAt.getFullYear()) * 12 + (now.getMonth() - s.createdAt.getMonth());
    
    let expected = 0;
    let periodCost = s.monthlyCommitment;

    if (s.periodicity === 'MENSUAL') {
      expected = monthsSinceReg;
      periodCost = s.monthlyCommitment;
    } else if (s.periodicity === 'TRIMESTRAL') {
      expected = Math.floor(monthsSinceReg / 3);
      periodCost = s.monthlyCommitment * 3;
    } else if (s.periodicity === 'SEMESTRAL') {
      expected = Math.floor(monthsSinceReg / 6);
      periodCost = s.monthlyCommitment * 6;
    } else if (s.periodicity === 'ANUAL') {
      expected = Math.floor(monthsSinceReg / 12);
      periodCost = s.monthlyCommitment * 12;
    }

    if (periodCost <= 0) {
      return { ...s, expected: 0, paidCount: 0, owedPeriods: 0, debtAmount: 0, periodCost: 0 };
    }

    const totalPaid = s.sponsorPayments.reduce((sum, p) => sum + p.amount, 0);
    const paidCount = Math.floor(totalPaid / periodCost);
    const owedPeriods = expected - paidCount;
    const debtAmount = owedPeriods * periodCost;
    
    return { ...s, expected, paidCount, owedPeriods, debtAmount, periodCost };
  }).filter(s => s.owedPeriods > 0);

  return delayed;
}
