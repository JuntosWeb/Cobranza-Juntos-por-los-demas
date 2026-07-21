import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin Fundación',
      username: 'admin',
      passwordHash: adminPass,
      role: 'ADMIN',
    }
  });

  const staffPass = await bcrypt.hash('staff123', 10);
  await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      name: 'Staff Recepción',
      username: 'staff',
      passwordHash: staffPass,
      role: 'STAFF',
    }
  });

  console.log('Usuarios base creados!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
