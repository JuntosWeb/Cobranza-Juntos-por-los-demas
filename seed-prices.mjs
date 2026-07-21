import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const priceData = [
  {
    name: 'EQUINOTERAPIA - MONTA TERAPÉUTICA',
    prices: [
      { f: 1, s: 'A', p: 4455 }, { f: 1, s: 'B', p: 4010 }, { f: 1, s: 'C', p: 3605 },
      { f: 2, s: 'A', p: 6225 }, { f: 2, s: 'B', p: 5600 }, { f: 2, s: 'C', p: 5040 },
      { f: 3, s: 'A', p: 8875 }, { f: 3, s: 'B', p: 7985 }, { f: 3, s: 'C', p: 7185 }
    ]
  },
  {
    name: 'EQUINOTERAPIA - ESTIMULACIÓN TEMPRANA',
    prices: [
      { f: 1, s: 'A', p: 3300 }, { f: 1, s: 'B', p: 2970 }, { f: 1, s: 'C', p: 2670 },
      { f: 2, s: 'A', p: 5025 }, { f: 2, s: 'B', p: 4520 }, { f: 2, s: 'C', p: 4065 },
      { f: 3, s: 'A', p: 6765 }, { f: 3, s: 'B', p: 6085 }, { f: 3, s: 'C', p: 5475 }
    ]
  },
  {
    name: 'EQUINOTERAPIA - EQUITACIÓN',
    prices: [
      { f: 1, s: 'A', p: 3470 }, { f: 1, s: 'B', p: 3130 }, { f: 1, s: 'C', p: 2810 },
      { f: 2, s: 'A', p: 5050 }, { f: 2, s: 'B', p: 4540 }, { f: 2, s: 'C', p: 4090 },
      { f: 3, s: 'A', p: 6630 }, { f: 3, s: 'B', p: 5970 }, { f: 3, s: 'C', p: 5370 }
    ]
  },
  {
    name: 'EQUINOTERAPIA - VAULTING',
    prices: [
      { f: 1, s: 'A', p: 3495 }, { f: 1, s: 'B', p: 3145 }, { f: 1, s: 'C', p: 2830 },
      { f: 2, s: 'A', p: 4720 }, { f: 2, s: 'B', p: 4245 }, { f: 2, s: 'C', p: 3820 }
    ]
  },
  {
    name: 'EQUINOTERAPIA - PSICOTERAPIA ASISTIDA INDIVIDUAL',
    prices: [
      { f: 1, s: 'A', p: 3530 }, { f: 1, s: 'B', p: 3175 }, { f: 1, s: 'C', p: 2855 }
    ]
  },
  {
    name: 'EQUINOTERAPIA - PSICOTERAPIA ASISTIDA FAMILIAR',
    prices: [
      { f: 1, s: 'A', p: 4200 }, { f: 1, s: 'B', p: 3780 }, { f: 1, s: 'C', p: 3400 }
    ]
  },
  {
    name: 'EQUINOTERAPIA - PENSIÓN',
    prices: [
      { f: 1, s: 'A', p: 10930 }
    ]
  },
  {
    name: 'COGNICIÓN Y COMUNICACIÓN',
    prices: [
      { f: 1, s: 'A', p: 3550 }, { f: 1, s: 'B', p: 3200 }, { f: 1, s: 'C', p: 2880 },
      { f: 2, s: 'A', p: 5320 }, { f: 2, s: 'B', p: 4785 }, { f: 2, s: 'C', p: 4305 },
      { f: 3, s: 'A', p: 7200 }, { f: 3, s: 'B', p: 6480 }, { f: 3, s: 'C', p: 5830 }
    ]
  },
  {
    name: 'NEUROFEEDBACK/EDUFEED.',
    prices: [
      { f: 1, s: 'A', p: 3550 }, { f: 1, s: 'B', p: 3200 }, { f: 1, s: 'C', p: 2880 },
      { f: 2, s: 'A', p: 5320 }, { f: 2, s: 'B', p: 4785 }, { f: 2, s: 'C', p: 4305 },
      { f: 3, s: 'A', p: 7200 }, { f: 3, s: 'B', p: 6480 }, { f: 3, s: 'C', p: 5830 }
    ]
  },
  {
    name: 'LOGOFONIATRÍA',
    prices: [
      { f: 1, s: 'A', p: 3550 }, { f: 1, s: 'B', p: 3200 }, { f: 1, s: 'C', p: 2880 },
      { f: 2, s: 'A', p: 5320 }, { f: 2, s: 'B', p: 4785 }, { f: 2, s: 'C', p: 4305 },
      { f: 3, s: 'A', p: 7200 }, { f: 3, s: 'B', p: 6480 }, { f: 3, s: 'C', p: 5830 }
    ]
  },
  {
    name: 'ESTIMULACIÓN MAGNÉTICA TRANSCRANEAL',
    prices: [
      { f: 1, s: 'A', p: 34800 }
    ]
  },
  {
    name: 'PSICOLOGÍA',
    prices: [
      { f: 1, s: 'A', p: 2825 }, { f: 1, s: 'B', p: 2543 }, { f: 1, s: 'C', p: 2288 },
      { f: 2, s: 'A', p: 4240 }, { f: 2, s: 'B', p: 3815 }, { f: 2, s: 'C', p: 3435 },
      { f: 3, s: 'A', p: 5760 }, { f: 3, s: 'B', p: 5185 }, { f: 3, s: 'C', p: 4665 }
    ]
  },
  {
    name: 'MOTRICIDAD - NEURODESARROLLO Y CEMS',
    prices: [
      { f: 1, s: 'A', p: 3145 }, { f: 1, s: 'B', p: 2830 }, { f: 1, s: 'C', p: 2545 },
      { f: 2, s: 'A', p: 4720 }, { f: 2, s: 'B', p: 4250 }, { f: 2, s: 'C', p: 3825 },
      { f: 3, s: 'A', p: 6420 }, { f: 3, s: 'B', p: 5775 }, { f: 3, s: 'C', p: 5200 }
    ]
  },
  {
    name: 'FISIOTERAPIA - INSTALACIONES',
    prices: [
      { f: 1, s: 'A', p: 525 }
    ]
  },
  {
    name: 'FISIOTERAPIA - DOMICILIO',
    prices: [
      { f: 1, s: 'A', p: 935 }
    ]
  },
  {
    name: 'PSICOMOTRICIDAD RECREATIVA',
    prices: [
      { f: 1, s: 'A', p: 1815 }, { f: 1, s: 'B', p: 1630 }, { f: 1, s: 'C', p: 1465 },
      { f: 2, s: 'A', p: 3520 }, { f: 2, s: 'B', p: 3168 }, { f: 2, s: 'C', p: 2850 },
      { f: 3, s: 'A', p: 4920 }, { f: 3, s: 'B', p: 4428 }, { f: 3, s: 'C', p: 3985 }
    ]
  },
  {
    name: 'ALBERCA - HIDROTERAPIA',
    prices: [
      { f: 1, s: 'A', p: 2825 }, { f: 1, s: 'B', p: 2543 }, { f: 1, s: 'C', p: 2288 },
      { f: 2, s: 'A', p: 5360 }, { f: 2, s: 'B', p: 4825 }, { f: 2, s: 'C', p: 4345 },
      { f: 3, s: 'A', p: 7740 }, { f: 3, s: 'B', p: 6965 }, { f: 3, s: 'C', p: 6270 }
    ]
  },
  {
    name: 'ALBERCA - NATACIÓN ESPECIAL',
    prices: [
      { f: 1, s: 'A', p: 1815 }, { f: 1, s: 'B', p: 1630 }, { f: 1, s: 'C', p: 1465 },
      { f: 2, s: 'A', p: 3520 }, { f: 2, s: 'B', p: 3165 }, { f: 2, s: 'C', p: 2850 },
      { f: 3, s: 'A', p: 4920 }, { f: 3, s: 'B', p: 4425 }, { f: 3, s: 'C', p: 3983 }
    ]
  },
  {
    name: 'ALBERCA - NATACIÓN INDIVIDUAL',
    prices: [
      { f: 1, s: 'A', p: 1165 }, { f: 1, s: 'B', p: 1045 }, { f: 1, s: 'C', p: 940 },
      { f: 2, s: 'A', p: 2265 }, { f: 2, s: 'B', p: 2035 }, { f: 2, s: 'C', p: 1830 },
      { f: 3, s: 'A', p: 3110 }, { f: 3, s: 'B', p: 2795 }, { f: 3, s: 'C', p: 2515 }
    ]
  },
  {
    name: 'ALBERCA - NATACIÓN GRUPAL',
    prices: [
      { f: 1, s: 'A', p: 825 }, { f: 1, s: 'B', p: 740 }, { f: 1, s: 'C', p: 665 },
      { f: 2, s: 'A', p: 1210 }, { f: 2, s: 'B', p: 1295 }, { f: 2, s: 'C', p: 1165 },
      { f: 3, s: 'A', p: 1485 }, { f: 3, s: 'B', p: 1337 }, { f: 3, s: 'C', p: 1203 }
    ]
  },
  {
    name: 'ALBERCA - NADO LIBRE',
    prices: [
      { f: 1, s: 'A', p: 1395 }
    ]
  }
];

async function main() {
  console.log('Purgando ServicePrices...');
  await prisma.servicePrice.deleteMany();
  
  console.log('Purgando Services...');
  // First we need to delete existing PatientServices since they are linked to Services
  await prisma.patientService.deleteMany();
  await prisma.service.deleteMany();

  console.log('Insertando catálogo de precios 2026...');
  
  for (const item of priceData) {
    const service = await prisma.service.create({
      data: { name: item.name }
    });

    const priceRecords = item.prices.map(p => ({
      serviceId: service.id,
      frequency: p.f,
      scheduleType: p.s,
      monthlyPrice: p.p
    }));

    await prisma.servicePrice.createMany({
      data: priceRecords
    });
  }

  console.log('¡Catálogo 2026 inyectado con éxito!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
