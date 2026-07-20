import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando sembrado general de base de datos...')

  // 1. Limpiar la base de datos de manera segura
  // No se limpia todo automáticamente en Supabase remoto si no es con reset, 
  // pero upsert previene duplicados.

  // 1. Crear configuración global
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      lateFeePercentage: 0.10,
      quarterlyDiscount: 0.10,
      daysBeforeLateFee: 5,
      weeksBeforeSuspension: 4,
    },
  })
  console.log('✅ Configuración global lista.')

  // 2. Poblar Servicios y Precios
  const equino = await prisma.service.upsert({
    where: { name: 'EQUINOTERAPIA' },
    update: {},
    create: { name: 'EQUINOTERAPIA' },
  })
  
  const natacion = await prisma.service.upsert({
    where: { name: 'NATACIÓN' },
    update: {},
    create: { name: 'NATACIÓN' },
  })

  await prisma.servicePrice.createMany({
    data: [
      { serviceId: equino.id, frequency: 1, scheduleType: 'A', monthlyPrice: 800 },
      { serviceId: equino.id, frequency: 2, scheduleType: 'A', monthlyPrice: 1500 },
      { serviceId: natacion.id, frequency: 1, scheduleType: 'B', monthlyPrice: 900 },
      { serviceId: natacion.id, frequency: 3, scheduleType: 'C', monthlyPrice: 2000 },
    ],
    skipDuplicates: true,
  })

  // 3. Crear Padrinos de Prueba
  const sponsor1 = await prisma.sponsor.create({
    data: {
      name: 'Empresa Socialmente Responsable S.A.',
      folio: 'P-001',
      monthlyCommitment: 5000,
      periodicity: 'MENSUAL',
      billingContactName: 'Lic. Mariana Valdez',
      whatsapp: '5551234567'
    }
  });

  const sponsor2 = await prisma.sponsor.create({
    data: {
      name: 'Fundación Aliada',
      folio: 'P-002',
      monthlyCommitment: 10000,
      periodicity: 'TRIMESTRAL',
      billingContactName: 'Ing. Carlos Ruiz'
    }
  });

  // 4. Crear pacientes ficticios con cargos
  console.log('👥 Creando 6 pacientes de prueba (5 al corriente, 1 vencido)...')
  
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // PACIENTE 1: Particular, Al Corriente (Pagó este mes)
  const p1 = await prisma.patient.upsert({
    where: { folio: 'F/001' },
    update: {},
    create: {
      folio: 'F/001',
      fullName: 'Ana García (Particular - Al Corriente)',
      status: 'ACTIVE',
      category: 'PARTICULAR',
      services: {
        create: { serviceId: equino.id, frequency: 1, scheduleType: 'A', agreedPrice: 800 }
      },
      charges: {
        create: [
          { periodMonth: currentMonth.getMonth() + 1, periodYear: currentMonth.getFullYear(), baseAmount: 800, dueDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 7), status: 'PAID' }
        ]
      }
    }
  });

  // PACIENTE 2: Particular, Al Corriente (Pagó trimestral por adelantado)
  const p2 = await prisma.patient.upsert({
    where: { folio: 'F/002' },
    update: {},
    create: {
      folio: 'F/002',
      fullName: 'Luis Méndez (Particular - Trimestral)',
      status: 'ACTIVE',
      category: 'PARTICULAR',
      services: {
        create: { serviceId: natacion.id, frequency: 3, scheduleType: 'C', agreedPrice: 2000 }
      },
      charges: {
        create: [
          { periodMonth: currentMonth.getMonth() + 1, periodYear: currentMonth.getFullYear(), baseAmount: 2000, dueDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 7), status: 'PAID' },
          { periodMonth: nextMonth.getMonth() + 1, periodYear: nextMonth.getFullYear(), baseAmount: 2000, dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 7), status: 'PAID' }
        ]
      }
    }
  });

  // PACIENTE 3: Fundación, Padrino 1
  const p3 = await prisma.patient.upsert({
    where: { folio: 'F/003' },
    update: {},
    create: {
      folio: 'F/003',
      fullName: 'María Fernández (Fundación - Padrino 1)',
      status: 'ACTIVE',
      category: 'FUNDACION',
      sponsorId: sponsor1.id,
      services: {
        create: { serviceId: equino.id, frequency: 2, scheduleType: 'A', agreedPrice: 1500 }
      },
      charges: {
        create: [
          { periodMonth: currentMonth.getMonth() + 1, periodYear: currentMonth.getFullYear(), baseAmount: 1500, dueDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 7), status: 'PENDING' }
        ]
      }
    }
  });

  // PACIENTE 4: Fundación, Padrino 2
  const p4 = await prisma.patient.upsert({
    where: { folio: 'F/004' },
    update: {},
    create: {
      folio: 'F/004',
      fullName: 'Roberto Gómez (Fundación - Padrino 2)',
      status: 'ACTIVE',
      category: 'FUNDACION',
      sponsorId: sponsor2.id,
      services: {
        create: { serviceId: natacion.id, frequency: 1, scheduleType: 'B', agreedPrice: 900 }
      },
      charges: {
        create: [
          { periodMonth: currentMonth.getMonth() + 1, periodYear: currentMonth.getFullYear(), baseAmount: 900, dueDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 7), status: 'PENDING' }
        ]
      }
    }
  });

  // PACIENTE 5: Particular, Primer Mes (Al corriente pero pendiente de pagar hoy)
  const p5 = await prisma.patient.upsert({
    where: { folio: 'F/005' },
    update: {},
    create: {
      folio: 'F/005',
      fullName: 'Sofía López (Particular - Pendiente Mes Actual)',
      status: 'ACTIVE',
      category: 'PARTICULAR',
      services: {
        create: { serviceId: equino.id, frequency: 1, scheduleType: 'A', agreedPrice: 800 }
      },
      charges: {
        create: [
          { periodMonth: currentMonth.getMonth() + 1, periodYear: currentMonth.getFullYear(), baseAmount: 800, dueDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 7), status: 'PENDING' }
        ]
      }
    }
  });

  // PACIENTE 6: VENCIDO (Debe mes anterior con recargos)
  const p6 = await prisma.patient.upsert({
    where: { folio: 'F/006' },
    update: {},
    create: {
      folio: 'F/006',
      fullName: 'Carlos Ruiz (Particular - MOROSO)',
      status: 'ACTIVE',
      category: 'PARTICULAR',
      services: {
        create: { serviceId: equino.id, frequency: 2, scheduleType: 'A', agreedPrice: 1500 }
      },
      charges: {
        create: [
          { periodMonth: lastMonth.getMonth() + 1, periodYear: lastMonth.getFullYear(), baseAmount: 1500, lateFee: 150, dueDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 7), status: 'PENDING' },
          { periodMonth: currentMonth.getMonth() + 1, periodYear: currentMonth.getFullYear(), baseAmount: 1500, dueDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 7), status: 'PENDING' }
        ]
      }
    }
  });

  console.log('✅ Pacientes y cargos de prueba listos.')
  console.log('✅ Sembrado completado con éxito.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
