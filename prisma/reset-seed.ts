import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function resetSeed() {
  console.log('🧹 [WOW Salon] Running Demo Data Reset Script...');

  // Production environment safety guard
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ CRITICAL SAFETY ABORT: reset-seed cannot be executed in a production environment!');
  }

  // Demo user emails to safely target seeded demo data
  const demoEmails = [
    'admin@wowsalon.lk',
    'dilani@gmail.com',
    'sanduni@gmail.com',
    'kaveesha@gmail.com',
    'kasun@gmail.com',
    'nuwan@gmail.com',
    'tharindu@gmail.com',
    'nadeesha@wowsalon.lk',
    'ishara@wowsalon.lk',
    'pubudu@wowsalon.lk',
    'dinesh@wowsalon.lk',
    'admin@salonwow.com', // legacy seed email if present
  ];

  const demoUsers = await prisma.user.findMany({
    where: { email: { in: demoEmails } },
    select: { user_id: true },
  });
  const demoUserIds = demoUsers.map((u) => u.user_id);

  console.log(`Found ${demoUserIds.length} demo user profiles to clean up.`);

  // 1. Delete dependent leaf tables in reverse foreign-key order
  await prisma.appointmentService.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.hairstyleRecommendation.deleteMany();
  await prisma.deviceToken.deleteMany();
  await prisma.stylistService.deleteMany();
  await prisma.offerService.deleteMany();

  // 2. Delete appointments & slots
  await prisma.appointment.deleteMany();
  await prisma.timeSlot.deleteMany();

  // 3. Delete schedules and calendars
  await prisma.break.deleteMany();
  await prisma.unavailableDate.deleteMany();
  await prisma.workingHours.deleteMany();

  // 4. Delete catalog and settings
  await prisma.offer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.salonSettings.deleteMany();

  // 5. Delete roles & profiles
  await prisma.loyalty.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.admin.deleteMany();

  // 6. Delete users
  if (demoUserIds.length > 0) {
    await prisma.user.deleteMany({
      where: { user_id: { in: demoUserIds } },
    });
  }

  console.log('✅ Demo data successfully cleaned up in safe foreign-key order.');
}

resetSeed()
  .catch((e) => {
    console.error('❌ Error in reset-seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
