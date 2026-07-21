"use server";
import prisma from '@/lib/prisma';



export async function getAllActivePatients() {
  return prisma.patient.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, fullName: true, folio: true },
    orderBy: { fullName: 'asc' }
  });
}
