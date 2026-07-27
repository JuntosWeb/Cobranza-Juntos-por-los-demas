"use server";

import { PatientStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';



type CreatePatientInput = {
  folio?: string;
  fullName: string;
  category: string;
  serviceId: string;
  frequency: number;
  scheduleType: string;
  agreedPrice: number;
  notes?: string;
  sponsorId?: string | null;
  chargeInscription?: boolean;
  status?: PatientStatus;
  suspensionReason?: string | null;
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
    const settings = await prisma.systemSettings.findFirst();
    const inscriptionFee = settings?.inscriptionFee || 1700;

    const newPatient = await prisma.patient.create({
      data: {
        folio: data.folio || undefined,
        fullName: data.fullName,
        category: data.category,
        notes: data.notes,
        sponsorId: data.sponsorId,
        services: {
          create: {
            serviceId: data.serviceId,
            frequency: data.frequency,
            scheduleType: data.scheduleType,
            agreedPrice: data.agreedPrice
          }
        },
        charges: data.chargeInscription ? {
          create: {
            periodMonth: new Date().getMonth() + 1,
            periodYear: new Date().getFullYear(),
            concept: "Inscripción Anual",
            baseAmount: inscriptionFee,
            dueDate: new Date(),
            status: 'PENDING'
          }
        } : undefined
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
    // aqui le movemos a los datos basicos del paciente
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        folio: data.folio || undefined,
        fullName: data.fullName,
        category: data.category,
        notes: data.notes,
        sponsorId: data.sponsorId,
        status: data.status,
        suspensionReason: data.suspensionReason
      }
    });

    // quitamos el servicio viejo y metemos el nuevo para que funcione
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
  const settings = await prisma.systemSettings.findFirst();
  const holidays = settings?.holidays || [];

  return patients.map(p => {
    // si el paciente debe dinero y ya paso la fecha de pago lo marcamos como moroso
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

      // Verificamos si la fecha límite de pago ha pasado para aplicar el recargo
      const shouldBypassLateFee = hasDirectorDiscount && (settings?.exemptDiscountedFromLateFees !== false);

      if (c.dueDate < now && currentLateFee === 0 && !shouldBypassLateFee) {
        // sacamos cuanto le vamos a cobrar de recargo
        const lateFeePercentage = settings?.lateFeePercentage || 0.10;
        currentLateFee = c.baseAmount * lateFeePercentage; // Sumamos el recargo dinámico
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
      // TODO: aqui me falta checar si la transferencia ya paso o sigue pendiente, luego lo hago
      hasPendingTransfer: false 
    };
  });
}

export async function getPatientsForSuspension() {
  const settings = await prisma.systemSettings.findFirst();
  const weeksLimit = settings?.weeksBeforeSuspension || 4;
  
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - (weeksLimit * 7));

  // buscamos los pacientes que ya se pasaron del limite de semanas sin pagar
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

export async function createExtraordinaryCharge(patientId: string, concept: string, amount: number) {
  try {
    await prisma.charge.create({
      data: {
        patientId,
        periodMonth: 0,
        periodYear: new Date().getFullYear(),
        concept,
        baseAmount: amount,
        dueDate: new Date(),
        status: 'PENDING'
      }
    });
    revalidatePath('/dashboard/cobranza');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al generar cargo' };
  }
}

export async function cancelCharge(chargeId: string) {
  try {
    await prisma.charge.update({
      where: { id: chargeId },
      data: { status: 'CANCELLED' }
    });
    revalidatePath('/dashboard/cobranza');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al cancelar cargo' };
  }
}
