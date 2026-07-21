import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const excelData = [
  { name: "MONTA TERAPEUTICA", prices: [
    { freq: 1, a: 4455, b: 4009.5, c: 3605 },
    { freq: 2, a: 6225, b: 5600, c: 5040 },
    { freq: 3, a: 8875, b: 7985, c: 7185 },
  ]},
  { name: "ESTIMULACIÓN TEMPRANA C/ CABALLOS", prices: [
    { freq: 1, a: 3300, b: 2970, c: 2670 },
    { freq: 2, a: 5025, b: 4520, c: 4065 },
    { freq: 3, a: 6765, b: 6085, c: 5475 },
  ]},
  { name: "EQUITACION", prices: [
    { freq: 1, a: 3470, b: 3130, c: 2810 },
    { freq: 2, a: 5050, b: 4540, c: 4090 },
    { freq: 3, a: 6630, b: 5970, c: 5370 },
  ]},
  { name: "VAULTING", prices: [
    { freq: 1, a: 3495, b: 3145, c: 2830 },
    { freq: 2, a: 4720, b: 4245, c: 3820 },
  ]},
  { name: "PSICOTERAPIA ASISTIDA INDIVIDUAL", prices: [
    { freq: 1, a: 3530, b: 3175, c: 2855 },
  ]},
  { name: "PSICOTERAPIA ASISTIDA FAMILIAR", prices: [
    { freq: 1, a: 4200, b: 3780, c: 3400 },
  ]},
  { name: "COGNICION Y COMUNICACIÓN", prices: [
    { freq: 1, a: 3550, b: 3200, c: 2880 },
    { freq: 2, a: 5320, b: 4785, c: 4305 },
    { freq: 3, a: 7200, b: 6480, c: 5830 },
  ]},
  { name: "NEUROFEEDBACK / EDUFEED.", prices: [
    { freq: 1, a: 3550, b: 3200, c: 2880 },
    { freq: 2, a: 5320, b: 4785, c: 4305 },
    { freq: 3, a: 7200, b: 6480, c: 5830 },
  ]},
  { name: "LOGOFONIATRIA", prices: [
    { freq: 1, a: 3550, b: 3200, c: 2880 },
    { freq: 2, a: 5320, b: 4785, c: 4305 },
    { freq: 3, a: 7200, b: 6480, c: 5830 },
  ]},
];

async function main() {
  // First clear old services that have NO patients assigned. (Only for a clean slate)
  // Wait, let's just deactivate all existing prices and upsert services.
  for (const sData of excelData) {
    let service = await prisma.service.findUnique({ where: { name: sData.name } });
    if (!service) {
      service = await prisma.service.create({ data: { name: sData.name } });
    }
    
    // Deactivate existing prices for this service to start fresh
    await prisma.servicePrice.updateMany({
      where: { serviceId: service.id },
      data: { isActive: false }
    });

    for (const p of sData.prices) {
      if (p.a) await prisma.servicePrice.create({ data: { serviceId: service.id, frequency: p.freq, scheduleType: "A", monthlyPrice: Math.round(p.a) } });
      if (p.b) await prisma.servicePrice.create({ data: { serviceId: service.id, frequency: p.freq, scheduleType: "B", monthlyPrice: Math.round(p.b) } });
      if (p.c) await prisma.servicePrice.create({ data: { serviceId: service.id, frequency: p.freq, scheduleType: "C", monthlyPrice: Math.round(p.c) } });
    }
    console.log(`Imported ${sData.name} with ${sData.prices.length * 3} prices.`);
  }
}
main().then(() => { console.log("Done!"); prisma.$disconnect(); }).catch(e => { console.error(e); prisma.$disconnect(); });
