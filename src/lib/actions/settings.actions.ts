"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

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
        holidays: []
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
}) {
  try {
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
