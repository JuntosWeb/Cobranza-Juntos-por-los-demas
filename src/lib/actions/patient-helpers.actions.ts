"use server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllActivePatients() {
  return prisma.patient.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, fullName: true, folio: true },
    orderBy: { fullName: 'asc' }
  });
}
