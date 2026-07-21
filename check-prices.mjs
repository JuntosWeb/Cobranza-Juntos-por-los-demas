import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.servicePrice.count();
  const services = await prisma.service.count();
  console.log(`Verificación Exitosa: Se cargaron ${services} servicios/categorías con un total de ${count} combinaciones de precio.`);
  
  const allServices = await prisma.service.findMany({
    include: { prices: { orderBy: [{ frequency: 'asc' }, { scheduleType: 'asc' }] } }
  });

  for (const s of allServices) {
    console.log(`\n-- ${s.name} --`);
    s.prices.forEach(p => {
      console.log(`  - Frecuencia: ${p.frequency} | Horario: ${p.scheduleType} | Precio: $${p.monthlyPrice}`);
    });
  }
}
main().finally(() => prisma.$disconnect());
