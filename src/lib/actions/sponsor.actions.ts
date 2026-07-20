"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

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

export async function getDelayedSponsors() {
  const sponsors = await prisma.sponsor.findMany({
    include: { sponsorPayments: { where: { status: 'COMPLETED' } } }
  });
  
  const now = new Date();
  const delayed = sponsors.map(s => {
    const monthsSinceReg = (now.getFullYear() - s.createdAt.getFullYear()) * 12 + (now.getMonth() - s.createdAt.getMonth());
    
    let expected = 0;
    if (s.periodicity === 'MENSUAL') expected = monthsSinceReg;
    if (s.periodicity === 'TRIMESTRAL') expected = Math.floor(monthsSinceReg / 3);
    if (s.periodicity === 'ANUAL') expected = Math.floor(monthsSinceReg / 12);

    // Grace period: Si se acaban de registrar este mes, expected = 0. 
    // Si expected es mayor que los pagos, deben.
    const paidCount = s.sponsorPayments.length;
    const owedPeriods = expected - paidCount;
    
    return { ...s, expected, paidCount, owedPeriods };
  }).filter(s => s.owedPeriods > 0);

  return delayed;
}
