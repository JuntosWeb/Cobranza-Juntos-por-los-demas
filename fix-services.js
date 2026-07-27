const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany();
  for (const s of services) {
    let newName = s.name;
    if (newName.includes('ESTIMULACIÓN TEMPRANA')) {
      newName = newName.replace('ESTIMULACIÓN TEMPRANA', 'CONOCIENDO MI CABALLO');
    }
    if (newName.includes('-')) {
      newName = newName.split('-')[1].trim();
    }
    if (newName !== s.name) {
      console.log(`Renaming: ${s.name} -> ${newName}`);
      try {
         await prisma.service.update({ where: { id: s.id }, data: { name: newName } });
      } catch(e) {
         console.log('Error (maybe duplicate):', e.message);
      }
    }
  }
}
main();
