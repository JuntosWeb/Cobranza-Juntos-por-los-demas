import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando reseteo e inyección de datos de prueba...');

  // 1. Borrar datos operativos existentes
  console.log('Borrando datos operativos (pagos, cargos, pacientes, padrinos)...');
  await prisma.paymentCharge.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.patientService.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.sponsorPayment.deleteMany();
  await prisma.sponsor.deleteMany();

  // Asegurar que exista al menos un servicio y un precio
  let service = await prisma.service.findFirst({ where: { name: 'EQUINOTERAPIA' } });
  if (!service) {
    service = await prisma.service.create({
      data: { name: 'EQUINOTERAPIA' }
    });
  }

  let price = await prisma.servicePrice.findFirst({ where: { serviceId: service.id, frequency: 1, scheduleType: 'A' } });
  if (!price) {
    price = await prisma.servicePrice.create({
      data: {
        serviceId: service.id,
        frequency: 1,
        scheduleType: 'A',
        monthlyPrice: 3150
      }
    });
  }

  // 2. Crear Padrinos
  console.log('Creando padrinos...');
  const sponsors = [];
  
  // Padrino 1: Cumpleaños 23 de julio
  const sp1 = await prisma.sponsor.create({
    data: {
      folio: 'P001',
      name: 'Daniel Vargas (Cumpleañero)',
      monthlyCommitment: 5000,
      birthday: new Date(1980, 6, 23), // Mes 6 = Julio en Date JS
      periodicity: 'MENSUAL',
      contributionMethod: 'TRANSFERENCIA'
    }
  });
  sponsors.push(sp1);

  // Padrino 2
  const sp2 = await prisma.sponsor.create({
    data: {
      folio: 'P002',
      name: 'Empresa Altruista S.A.',
      monthlyCommitment: 10000,
      birthday: new Date(1975, 1, 15),
      periodicity: 'MENSUAL',
      contributionMethod: 'TC'
    }
  });
  sponsors.push(sp2);

  // 3. Crear Pacientes
  console.log('Creando pacientes...');
  
  // Paciente Particular (Al corriente)
  const pat1 = await prisma.patient.create({
    data: {
      folio: 'F/1001',
      fullName: 'Juanito Pérez (Particular - Al corriente)',
      category: 'PARTICULAR',
      status: 'ACTIVE',
      services: {
        create: {
          serviceId: service.id,
          frequency: 1,
          scheduleType: 'A',
          agreedPrice: 3150
        }
      }
    }
  });

  // Cargo pagado para pat1 (Mes actual - Julio 2026)
  const c1 = await prisma.charge.create({
    data: {
      patientId: pat1.id,
      periodMonth: 7,
      periodYear: 2026,
      baseAmount: 3150,
      lateFee: 0,
      dueDate: new Date(2026, 6, 7), // 7 de julio (5to dia habil)
      status: 'PAID'
    }
  });
  const p1 = await prisma.payment.create({
    data: {
      patientId: pat1.id,
      totalBaseAmount: 3150,
      finalAmountPaid: 3150,
      paymentDate: new Date(2026, 6, 2),
      paymentMethod: 'TRANSFER',
      recordedBy: 'Admin (Seed)'
    }
  });
  await prisma.paymentCharge.create({ data: { paymentId: p1.id, chargeId: c1.id, amountAllocated: 3150 }});

  // Paciente Particular (Moroso - Con deuda)
  const pat2 = await prisma.patient.create({
    data: {
      folio: 'F/1002',
      fullName: 'María López (Particular - Morosa)',
      category: 'PARTICULAR',
      status: 'ACTIVE',
      services: {
        create: {
          serviceId: service.id,
          frequency: 1,
          scheduleType: 'B',
          agreedPrice: 2000
        }
      }
    }
  });
  // Cargo vencido y con recargo
  await prisma.charge.create({
    data: {
      patientId: pat2.id,
      periodMonth: 7,
      periodYear: 2026,
      baseAmount: 2000,
      lateFee: 200, // 10% recargo
      dueDate: new Date(2026, 6, 7),
      status: 'PENDING'
    }
  });

  // Paciente Fundación (Patrocinado por Padrino 1)
  const pat3 = await prisma.patient.create({
    data: {
      folio: 'F/1003',
      fullName: 'Luisito Fernández (Fundación - Padrino 1)',
      category: 'FUNDACION',
      status: 'ACTIVE',
      sponsorId: sp1.id,
      services: {
        create: {
          serviceId: service.id,
          frequency: 2,
          scheduleType: 'C',
          agreedPrice: 1500 // Descuento de direcciòn aplicado
        }
      }
    }
  });
  // Cargo pendiente para Fundación
  await prisma.charge.create({
    data: {
      patientId: pat3.id,
      periodMonth: 7,
      periodYear: 2026,
      baseAmount: 1500,
      lateFee: 0,
      dueDate: new Date(2026, 6, 7),
      status: 'PENDING'
    }
  });

  // Paciente Suspendido (Con deuda histórica)
  const pat4 = await prisma.patient.create({
    data: {
      folio: 'F/1004',
      fullName: 'Ana Martínez (Suspendida)',
      category: 'PARTICULAR',
      status: 'SUSPENDED',
      suspensionReason: 'Falta de pago prolongada',
      services: {
        create: {
          serviceId: service.id,
          frequency: 1,
          scheduleType: 'A',
          agreedPrice: 3000
        }
      }
    }
  });
  await prisma.charge.create({
    data: {
      patientId: pat4.id,
      periodMonth: 6, // Mes anterior
      periodYear: 2026,
      baseAmount: 3000,
      lateFee: 300,
      dueDate: new Date(2026, 5, 7),
      status: 'PENDING'
    }
  });

  // Crear 15 pacientes adicionales mixtos para bulto
  for (let i = 0; i < 15; i++) {
    const isFundacion = i % 3 === 0;
    const isMoroso = i % 4 === 0;
    const p = await prisma.patient.create({
      data: {
        folio: `F/200${i}`,
        fullName: `Paciente Prueba ${i} (${isFundacion ? 'Fundación' : 'Particular'})`,
        category: isFundacion ? 'FUNDACION' : 'PARTICULAR',
        status: 'ACTIVE',
        sponsorId: isFundacion ? sp2.id : null,
        services: {
          create: {
            serviceId: service.id,
            frequency: (i % 3) + 1,
            scheduleType: 'A',
            agreedPrice: 3150
          }
        }
      }
    });

    const ch = await prisma.charge.create({
      data: {
        patientId: p.id,
        periodMonth: 7,
        periodYear: 2026,
        baseAmount: 3150,
        lateFee: isMoroso ? 315 : 0,
        dueDate: new Date(2026, 6, 7),
        status: isMoroso ? 'PENDING' : 'PAID'
      }
    });

    if (!isMoroso) {
      const pay = await prisma.payment.create({
        data: {
          patientId: p.id,
          totalBaseAmount: 3150,
          finalAmountPaid: 3150,
          paymentDate: new Date(2026, 6, 5),
          paymentMethod: 'CASH',
          recordedBy: 'Admin (Seed)'
        }
      });
      await prisma.paymentCharge.create({ data: { paymentId: pay.id, chargeId: ch.id, amountAllocated: 3150 }});
    }
  }

  console.log('¡Datos de prueba inyectados con éxito!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
