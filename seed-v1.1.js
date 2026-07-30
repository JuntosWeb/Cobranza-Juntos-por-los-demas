const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando DB para demostracion V1.1...");
  await prisma.paymentCharge.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.patientService.deleteMany();
  await prisma.patient.deleteMany();

  const services = await prisma.service.findMany();
  if (services.length === 0) {
    console.log("Error: No hay servicios");
    return;
  }
  const s = services[0];
  const price = 2500;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Función helper para generar paciente
  async function createPT(i, name, status = 'ACTIVE') {
    const folioStr = `PAC-${(i).toString().padStart(4, '0')}`;
    return await prisma.patient.create({
      data: {
        folio: folioStr,
        fullName: name,
        category: "PARTICULAR",
        status: status,
        services: {
          create: { serviceId: s.id, frequency: 2, scheduleType: "B", agreedPrice: price }
        }
      }
    });
  }

  // Función helper para generar cargo mensual regular
  async function createCharge(patientId, month, year, status = 'PENDING') {
    return await prisma.charge.create({
      data: {
        patientId,
        periodMonth: month,
        periodYear: year,
        baseAmount: price,
        dueDate: new Date(year, month - 1, 5),
        status,
        concept: null
      }
    });
  }

  // P1: Verde (Pagado mes anterior)
  const p1 = await createPT(1, "Ana Verde");
  const c1 = await createCharge(p1.id, currentMonth, currentYear, 'PAID');
  const pay1 = await prisma.payment.create({ data: { patientId: p1.id, totalBaseAmount: price, finalAmountPaid: price, paymentMethod: 'TRANSFER', paymentDate: new Date(prevYear, prevMonth - 1, 28), recordedBy: 'admin', status: 'COMPLETED' }});
  await prisma.paymentCharge.create({ data: { paymentId: pay1.id, chargeId: c1.id, amountAllocated: price }});

  // P2: Amarillo (Semana 1)
  const p2 = await createPT(2, "Carlos Amarillo");
  const c2 = await createCharge(p2.id, currentMonth, currentYear, 'PAID');
  const pay2 = await prisma.payment.create({ data: { patientId: p2.id, totalBaseAmount: price, finalAmountPaid: price, paymentMethod: 'CASH', paymentDate: new Date(currentYear, currentMonth - 1, 5), recordedBy: 'admin', status: 'COMPLETED' }});
  await prisma.paymentCharge.create({ data: { paymentId: pay2.id, chargeId: c2.id, amountAllocated: price }});

  // P3: Rosa (Semana 2)
  const p3 = await createPT(3, "Beto Rosa");
  const c3 = await createCharge(p3.id, currentMonth, currentYear, 'PAID');
  const pay3 = await prisma.payment.create({ data: { patientId: p3.id, totalBaseAmount: price, finalAmountPaid: price, paymentMethod: 'TRANSFER', paymentDate: new Date(currentYear, currentMonth - 1, 10), recordedBy: 'admin', status: 'COMPLETED' }});
  await prisma.paymentCharge.create({ data: { paymentId: pay3.id, chargeId: c3.id, amountAllocated: price }});

  // P4: Azul (Semana 3)
  const p4 = await createPT(4, "Diana Azul");
  const c4 = await createCharge(p4.id, currentMonth, currentYear, 'PAID');
  const pay4 = await prisma.payment.create({ data: { patientId: p4.id, totalBaseAmount: price, finalAmountPaid: price, paymentMethod: 'TRANSFER', paymentDate: new Date(currentYear, currentMonth - 1, 18), recordedBy: 'admin', status: 'COMPLETED' }});
  await prisma.paymentCharge.create({ data: { paymentId: pay4.id, chargeId: c4.id, amountAllocated: price }});

  // P5: Morado (Semana 4)
  const p5 = await createPT(5, "Elena Morado");
  const c5 = await createCharge(p5.id, currentMonth, currentYear, 'PAID');
  const pay5 = await prisma.payment.create({ data: { patientId: p5.id, totalBaseAmount: price, finalAmountPaid: price, paymentMethod: 'CARD', paymentDate: new Date(currentYear, currentMonth - 1, 26), recordedBy: 'admin', status: 'COMPLETED' }});
  await prisma.paymentCharge.create({ data: { paymentId: pay5.id, chargeId: c5.id, amountAllocated: price }});

  // P6: Rojo (Atraso mes actual)
  const p6 = await createPT(6, "Fernando Rojo");
  await createCharge(p6.id, currentMonth, currentYear, 'PENDING');

  // P7: Naranja (Adeudo viejo)
  const p7 = await createPT(7, "Gloria Naranja");
  await createCharge(p7.id, prevMonth, prevYear, 'PENDING'); // old
  await createCharge(p7.id, currentMonth, currentYear, 'PENDING'); // current

  // P8: Extras
  const p8 = await createPT(8, "Hector Extra");
  await createCharge(p8.id, currentMonth, currentYear, 'PENDING');
  await prisma.charge.create({
    data: {
      patientId: p8.id, periodMonth: currentMonth, periodYear: currentYear,
      baseAmount: 300, dueDate: new Date(), status: 'PENDING', concept: "Material Terapéutico"
    }
  });

  // P9: Descuento Histórico Trimestral (Pagó 3 meses y se le aplicó descuento)
  const p9 = await createPT(9, "Irma Descuento");
  const c9_1 = await createCharge(p9.id, currentMonth, currentYear, 'PAID');
  const c9_2 = await createCharge(p9.id, currentMonth === 12 ? 1 : currentMonth + 1, currentMonth === 12 ? currentYear + 1 : currentYear, 'PAID');
  const c9_3 = await createCharge(p9.id, currentMonth >= 11 ? (currentMonth + 2)%12 || 12 : currentMonth + 2, currentMonth >= 11 ? currentYear + 1 : currentYear, 'PAID');
  
  const discount = (price * 3) * 0.10;
  const total = (price * 3) - discount;
  const pay9 = await prisma.payment.create({ 
    data: { patientId: p9.id, totalBaseAmount: price * 3, finalAmountPaid: total, quarterlyDiscount: discount, paymentMethod: 'TRANSFER', paymentDate: new Date(), recordedBy: 'admin', status: 'COMPLETED' }
  });
  await prisma.paymentCharge.create({ data: { paymentId: pay9.id, chargeId: c9_1.id, amountAllocated: price }});
  await prisma.paymentCharge.create({ data: { paymentId: pay9.id, chargeId: c9_2.id, amountAllocated: price }});
  await prisma.paymentCharge.create({ data: { paymentId: pay9.id, chargeId: c9_3.id, amountAllocated: price - discount }});

  // P10: Baja Definitiva
  const p10 = await createPT(10, "Julio Baja", "INACTIVE");
  await prisma.patient.update({ where: { id: p10.id }, data: { suspensionReason: "Se mudó de ciudad" }});

  // Agregar algunos extras base normal para rellenar tabla
  for (let i = 11; i <= 15; i++) {
    const pt = await createPT(i, `Paciente Relleno ${i}`);
    await createCharge(pt.id, currentMonth, currentYear, 'PENDING');
  }

  console.log("Datos de prueba V1.1 inyectados exitosamente.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
