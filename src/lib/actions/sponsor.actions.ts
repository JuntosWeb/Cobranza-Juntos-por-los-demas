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
};

export async function upsertSponsor(data: SponsorInput) {
  try {
    if (data.id) {
      await prisma.sponsor.update({
        where: { id: data.id },
        data
      });
    } else {
      await prisma.sponsor.create({
        data
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
