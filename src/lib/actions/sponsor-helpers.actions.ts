"use server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllSponsors() {
  return prisma.sponsor.findMany({
    select: { id: true, name: true, folio: true },
    orderBy: { name: 'asc' }
  });
}
