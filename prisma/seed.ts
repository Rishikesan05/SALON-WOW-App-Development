import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // ─── Seed data will be added after schema models are defined ───
  // Each member will add seed data for their tables here.
  // Example:
  //   await prisma.service.createMany({
  //     data: [
  //       { name: 'Haircut', price: 1500, duration: 30 },
  //       { name: 'Hair Coloring', price: 5000, duration: 90 },
  //     ],
  //   });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
