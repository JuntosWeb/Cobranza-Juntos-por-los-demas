"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getBusinessDays } from '@/lib/utils/financial-rules';
import { auth } from '@/auth';

const checkAdmin = async () => {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Acceso denegado: Se requiere rol de Administrador.');
};


export async function getSystemSettings() {
  let settings = await prisma.systemSettings.findUnique({
    where: { id: 1 }
  });

  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        id: 1,
        lateFeePercentage: 0.10,
        quarterlyDiscount: 0.10,
        daysBeforeLateFee: 5,
        weeksBeforeSuspension: 4,
        holidays: [],
        inscriptionFee: 1700,
        patientCategories: ["FUNDACION", "PARTICULAR"],
        scheduleTypes: ["A", "B", "C"],
        exemptDiscountedFromLateFees: true
      }
    });
  }

  return settings;
}

export async function updateSystemSettings(data: {
  lateFeePercentage?: number;
  quarterlyDiscount?: number;
  daysBeforeLateFee?: number;
  weeksBeforeSuspension?: number;
  holidays?: Date[];
  inscriptionFee?: number;
  patientCategories?: string[];
  scheduleTypes?: string[];
  exemptDiscountedFromLateFees?: boolean;
}) {
  try {
    await checkAdmin();
    await prisma.systemSettings.update({
      where: { id: 1 },
      data
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function forceGenerateMonthlyCharges() {
  try {
    await checkAdmin();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const settings = await prisma.systemSettings.findFirst();
    const holidays = settings?.holidays || [];

    const activePatients = await prisma.patient.findMany({
      where: { status: 'ACTIVE' },
      include: { services: true }
    });

    let createdCount = 0;

    for (const patient of activePatients) {
      if (!patient.services || patient.services.length === 0) continue;
      
      const service = patient.services[0];

      const existingCharge = await prisma.charge.findFirst({
        where: {
          patientId: patient.id,
          periodMonth: currentMonth,
          periodYear: currentYear
        }
      });

      if (!existingCharge) {
        const limitDays = settings?.daysBeforeLateFee || 5;
        const dueDate = getBusinessDays(new Date(currentYear, currentMonth - 1, 1), holidays, limitDays);
        
        await prisma.charge.create({
          data: {
            patientId: patient.id,
            periodMonth: currentMonth,
            periodYear: currentYear,
            baseAmount: service.agreedPrice,
            dueDate: dueDate,
            status: 'PENDING'
          }
        });
        createdCount++;
      }
    }

    revalidatePath('/dashboard/cobranza');
    return { success: true, count: createdCount, message: `Se generaron ${createdCount} mensualidades nuevas.` };
  } catch (error: any) {
    return { success: false, error: 'Error al generar mensualidades' };
  }
}
