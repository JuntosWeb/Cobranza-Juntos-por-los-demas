"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type CreatePatientInput = {
  folio?: string;
  fullName: string;
  category: 'FUNDACION' | 'PARTICULAR';
  serviceId: string;
  frequency: number;
  scheduleType: string;
  agreedPrice: number;
  notes?: string;
};

export async function getServicePrices() {
  return prisma.servicePrice.findMany({
    where: { isActive: true },
    include: { service: true },
    orderBy: { service: { name: 'asc' } }
  });
}

export async function createPatient(data: CreatePatientInput) {
  try {
    const newPatient = await prisma.patient.create({
      data: {
        folio: data.folio || undefined,
        fullName: data.fullName,
        category: data.category,
        notes: data.notes,
        services: {
          create: {
            serviceId: data.serviceId,
            frequency: data.frequency,
            scheduleType: data.scheduleType,
            agreedPrice: data.agreedPrice
          }
        }
      }
    });
    
    revalidatePath('/dashboard/pacientes');
    revalidatePath('/dashboard/cobranza');
    
    return { success: true, patient: newPatient };
  } catch (error: any) {
    console.error('Error creating patient:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('folio')) {
      return { success: false, error: 'Este número de folio ya está asignado a otro paciente.' };
    }
    return { success: false, error: 'Error al registrar el paciente' };
  }
}

export async function updatePatient(patientId: string, data: CreatePatientInput) {
  try {
    // Actualizamos datos básicos
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        folio: data.folio || undefined,
        fullName: data.fullName,
        category: data.category,
        notes: data.notes,
      }
    });

    // Actualizamos el servicio. Borramos el actual y creamos el nuevo.
    await prisma.patientService.deleteMany({ where: { patientId } });
    await prisma.patientService.create({
      data: {
        patientId,
        serviceId: data.serviceId,
        frequency: data.frequency,
        scheduleType: data.scheduleType,
        agreedPrice: data.agreedPrice
      }
    });

    revalidatePath('/dashboard/pacientes');
    revalidatePath('/dashboard/cobranza');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating patient:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('folio')) {
      return { success: false, error: 'Este número de folio ya está asignado a otro paciente.' };
    }
    return { success: false, error: 'Error al actualizar el paciente' };
  }
}

export async function getPatientsWithPaymentStatus() {
  const patients = await prisma.patient.findMany({
    include: {
      services: { include: { service: true } },
      charges: {
        where: { status: 'PENDING' },
        orderBy: { dueDate: 'asc' }
      }
    },
    orderBy: { fullName: 'asc' }
  });

  const servicePrices = await prisma.servicePrice.findMany();

  return patients.map(p => {
    // El status real de mora se determina si hay algún cargo PENDING cuya dueDate ya pasó
    const now = new Date();
    let hasLateFee = false;
    let totalDebt = 0;

    const serviceConfig = p.services[0];
    let hasDirectorDiscount = false;
    if (serviceConfig) {
      const standardPriceRecord = servicePrices.find(sp => 
        sp.serviceId === serviceConfig.serviceId && 
        sp.frequency === serviceConfig.frequency && 
        sp.scheduleType === serviceConfig.scheduleType
      );
      if (standardPriceRecord && serviceConfig.agreedPrice < standardPriceRecord.monthlyPrice) {
        hasDirectorDiscount = true;
      }
    }

    const pendingCharges = p.charges.map(c => {
      let currentLateFee = c.lateFee;
      if (c.dueDate < now && currentLateFee === 0 && !hasDirectorDiscount) {
        currentLateFee = c.baseAmount * 0.10; // Recargo dinámico del 10%
      }
      if (currentLateFee > 0) hasLateFee = true;
      totalDebt += (c.baseAmount + currentLateFee);
      
      return { ...c, calculatedLateFee: currentLateFee };
    });

    const baseAmount = p.services[0]?.agreedPrice || 0;
    const serviceName = p.services[0]?.service?.name || 'N/A';
    const frequency = p.services[0]?.frequency || 0;
    const scheduleType = p.services[0]?.scheduleType || 'N/A';

    return {
      id: p.id,
      folio: p.folio,
      fullName: p.fullName,
      category: p.category,
      status: p.status,
      serviceName,
      frequency,
      scheduleType,
      baseAmount,
      hasLateFee,
      totalDebt,
      pendingCharges,
      // TODO: pending transfer check logic can be added later by checking Payment status
      hasPendingTransfer: false 
    };
  });
}

export async function getPatientsForSuspension() {
  const settings = await prisma.systemSettings.findFirst();
  const weeksLimit = settings?.weeksBeforeSuspension || 4;
  
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - (weeksLimit * 7));

  // Buscar pacientes ACTIVOS que tengan cargos PENDING con dueDate anterior al límite
  const patients = await prisma.patient.findMany({
    where: {
      status: 'ACTIVE',
      charges: {
        some: {
          status: 'PENDING',
          dueDate: { lt: limitDate }
        }
      }
    },
    include: {
      charges: { where: { status: 'PENDING' } },
      payments: { orderBy: { paymentDate: 'desc' }, take: 1 }
    }
  });

  return patients;
}

export async function suspendPatients(patientIds: string[], reason: string = 'SUSPENSION AUTOMATICA') {
  try {
    await prisma.patient.updateMany({
      where: { id: { in: patientIds } },
      data: { 
        status: 'SUSPENDED', 
        suspensionReason: reason 
      }
    });
    revalidatePath('/dashboard/cobranza');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al suspender pacientes' };
  }
}
