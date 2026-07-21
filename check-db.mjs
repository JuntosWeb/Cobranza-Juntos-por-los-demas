import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const s = await prisma.service.findMany({include: { prices: true }});
  console.log(JSON.stringify(s, null, 2));
}
main().finally(() => prisma.$disconnect());
