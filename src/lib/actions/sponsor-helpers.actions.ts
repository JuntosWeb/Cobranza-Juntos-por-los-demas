"use server";
import prisma from '@/lib/prisma';



export async function getAllSponsors() {
  return prisma.sponsor.findMany({
    select: { id: true, name: true, folio: true },
    orderBy: { name: 'asc' }
  });
}
