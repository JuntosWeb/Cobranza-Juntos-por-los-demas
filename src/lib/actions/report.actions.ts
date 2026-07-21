"use server";

import prisma from '@/lib/prisma';



export async function getAuditReportData(periodMonth: number, periodYear: number) {
  const charges = await prisma.charge.findMany({
    where: {
      periodMonth,
      periodYear,
      patient: {
        status: { not: 'INACTIVE' }
      }
    },
    include: {
      patient: {
        include: {
          services: {
            include: { service: true }
          }
        }
      },
      paymentAllocations: {
        include: { payment: true }
      }
    },
    orderBy: { patient: { fullName: 'asc' } }
  });

  return charges.map(charge => {
    const patient = charge.patient;
    const primaryService = patient.services[0];
    
    // Suma de pagos realizados a este cargo
    const totalPaid = charge.paymentAllocations.reduce((acc, alloc) => acc + alloc.amountAllocated, 0);
    
    // Si hay un pago, la fecha del primer pago nos puede dar una idea de la semana
    const firstPaymentDate = charge.paymentAllocations.length > 0 
      ? charge.paymentAllocations[0].payment.paymentDate 
      : null;
    
    const weekOfPayment = firstPaymentDate 
      ? Math.ceil(firstPaymentDate.getDate() / 7) 
      : null;

    return {
      id: charge.id,
      semanaDePago: weekOfPayment,
      area: primaryService?.service.name || 'N/A',
      folio: patient.folio || '',
      nombre: patient.fullName,
      servicio: primaryService?.service.name || 'N/A',
      vxs: primaryService?.frequency || 0,
      pago: totalPaid,
      precioDeLista: charge.baseAmount,
      inscripcionORecargo: charge.concept || '',
      descuento: 0, // El descuento de direccin ya va restado en el agreedPrice, se podra calcular si guardamos la diferencia
      recargos: charge.lateFee,
      comentarios: patient.notes || '',
      estado: charge.status,
      horario: primaryService?.scheduleType || ''
    };
  });
}
