"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { auth } from '@/auth';

const checkAdmin = async () => {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Acceso denegado: Se requiere rol de Administrador.');
};

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, username: true, role: true, isActive: true, createdAt: true }
  });
}

export async function createUser(data: { name: string; username: string; role: string; password?: string }) {
  try {
    await checkAdmin();
    const existing = await prisma.user.findUnique({ where: { username: data.username } });
    if (existing) {
      return { success: false, error: 'El nombre de usuario ya está en uso.' };
    }

    const passwordHash = await bcrypt.hash(data.password || '123456', 10);
    
    await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        role: data.role,
        passwordHash
      }
    });
    
    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUser(id: string, data: { name?: string; username?: string; role?: string; isActive?: boolean; password?: string }) {
  try {
    await checkAdmin();
    const updateData: any = { ...data };
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });

    revalidatePath('/dashboard/configuracion');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
