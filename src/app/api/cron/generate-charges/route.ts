import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Protegemos la ruta para que solo pueda ser llamada con un secreto o por Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('🔄 Iniciando generación automática de cargos mensuales...');
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 1. Obtener pacientes ACTIVOS con sus servicios
    const activePatients = await prisma.patient.findMany({
      where: { status: 'ACTIVE' },
      include: { services: true }
    });

    let createdCount = 0;

    for (const patient of activePatients) {
      if (!patient.services || patient.services.length === 0) continue;
      
      // Asumimos 1 servicio por paciente en este MVP
      const service = patient.services[0];

      // 2. Verificar si ya existe un cargo para este mes y año
      const existingCharge = await prisma.charge.findFirst({
        where: {
          patientId: patient.id,
          periodMonth: currentMonth,
          periodYear: currentYear
        }
      });

      // 3. Si no existe, lo creamos
      if (!existingCharge) {
        // La fecha de vencimiento es el día 7 del mes actual (según regla de 5 días hábiles aprox)
        const dueDate = new Date(currentYear, currentMonth - 1, 7);
        
        await prisma.charge.create({
          data: {
            patientId: patient.id,
            periodMonth: currentMonth,
            periodYear: currentYear,
            baseAmount: service.agreedPrice,
            dueDate: dueDate,
            status: 'PENDING'
          }
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Proceso completado. Se generaron ${createdCount} cargos nuevos para ${currentMonth}/${currentYear}.`
    });

  } catch (error) {
    console.error('Error en cron generate-charges:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
