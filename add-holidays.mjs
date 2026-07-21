import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.systemSettings.findUnique({ where: { id: 1 } });
  const existingHolidays = settings?.holidays || [];
  
  const mexicanHolidays2026 = [
    new Date('2026-01-01T00:00:00Z'), // Año Nuevo
    new Date('2026-02-02T00:00:00Z'), // Constitución
    new Date('2026-03-16T00:00:00Z'), // Natalicio Benito Juárez
    new Date('2026-05-01T00:00:00Z'), // Día del Trabajo
    new Date('2026-09-16T00:00:00Z'), // Independencia
    new Date('2026-11-16T00:00:00Z'), // Revolución
    new Date('2026-12-25T00:00:00Z'), // Navidad
  ];

  // Filter out duplicates based on timestamp
  const combined = [...existingHolidays, ...mexicanHolidays2026];
  const uniqueTimestamps = Array.from(new Set(combined.map(d => d.getTime())));
  const uniqueHolidays = uniqueTimestamps.map(t => new Date(t));

  await prisma.systemSettings.update({
    where: { id: 1 },
    data: {
      holidays: uniqueHolidays
    }
  });

  console.log('Días festivos de México (2026) agregados con éxito.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
