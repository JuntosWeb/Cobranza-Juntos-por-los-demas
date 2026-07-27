"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

const checkAdmin = async () => {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Acceso denegado: Se requiere rol de Administrador.');
};



export async function getServicesWithPrices() {
  return prisma.service.findMany({
    include: {
      prices: {
        where: { isActive: true },
        orderBy: [{ frequency: 'asc' }, { scheduleType: 'asc' }]
      }
    },
    orderBy: { name: 'asc' }
  });
}

export async function createService(name: string) {
  try {
    await checkAdmin();
    await prisma.service.create({
      data: { name: name.trim().toUpperCase() }
    });
    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateService(id: string, name: string) {
  try {
    await checkAdmin();
    await prisma.service.update({
      where: { id },
      data: { name: name.trim().toUpperCase() }
    });
    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteService(id: string) {
  try {
    await checkAdmin();
    await prisma.service.delete({
      where: { id }
    });
    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { success: false, error: 'No se puede eliminar porque este servicio ya está asignado a pacientes o tiene tarifas activas.' };
    }
    return { success: false, error: 'Ocurrió un error al eliminar el servicio.' };
  }
}

export async function upsertServicePrice(data: {
  id?: string;
  serviceId: string;
  frequency: number;
  scheduleType: string;
  monthlyPrice: number;
}) {
  try {
    await checkAdmin();
    if (data.id) {
      await prisma.servicePrice.update({
        where: { id: data.id },
        data: {
          frequency: data.frequency,
          scheduleType: data.scheduleType,
          monthlyPrice: data.monthlyPrice,
        }
      });
    } else {
      await prisma.servicePrice.create({
        data: {
          serviceId: data.serviceId,
          frequency: data.frequency,
          scheduleType: data.scheduleType,
          monthlyPrice: data.monthlyPrice,
        }
      });
    }
    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deactivateServicePrice(id: string) {
  try {
    await checkAdmin();
    await prisma.servicePrice.update({
      where: { id },
      data: { isActive: false }
    });
    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteServicePrice(id: string) {
  try {
    await checkAdmin();
    await prisma.servicePrice.delete({
      where: { id }
    });
    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Ocurrió un error al eliminar el precio.' };
  }
}
