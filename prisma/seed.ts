import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Salon WOW...');

  // 1. Clear existing data in reverse relation order (clean restart)
  await prisma.appointment.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.loyalty.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.salonSettings.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.break.deleteMany();
  await prisma.unavailableDate.deleteMany();

  // 2. Admin User (Moved to top so we can use admin_id)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Pubudu Harshana Amarakoon',
      email: 'admin@salonwow.com',
      phone: '0771234567',
      password_hash: '$2b$10$hashedAdminPasswordSample2026',
      role: 'ADMIN',
      admin: {
        create: {
          admin_username: 'pubudu_admin',
        },
      },
    },
    include: {
      admin: true, // Needed to get the admin_id
    },
  });
  const adminId = adminUser.admin!.admin_id; // Extract the admin_id
  console.log('✅ Admin User seeded:', adminUser.name);

  // 3. Salon Settings (Now linked to Admin)
  await prisma.salonSettings.create({
    data: {
      salon_name: 'WOW Salon',
      address: 'Main Street, Balangoda, Sri Lanka',
      contact_details: '077-1234567 / info@salonwow.lk',
      location: 'https://maps.google.com/?q=6.6508,80.7011',
      admin_id: adminId, // ADDED
    },
  });
  console.log('✅ Salon Settings seeded');

  // 4. Customer User
  const customerUser = await prisma.user.create({
    data: {
      name: 'S. Rishikesan',
      email: 'rishi@gmail.com',
      phone: '0770760636',
      password_hash: '$2b$10$hashedCustomerPasswordSample2026',
      role: 'CUSTOMER',
      customer: {
        create: {
          gender: 'Male',
          profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
          loyalty: {
            create: {
              points: 75,
              reward_info: 'Silver Tier Member - 5% OFF Next Visit',
              transaction_history: 'Initial bonus: 50 pts | Haircut visit: 25 pts',
            },
          },
        },
      },
    },
    include: {
      customer: true,
    },
  });
  console.log('✅ Customer User seeded:', customerUser.name);

  // 5. Stylists
  const stylist1 = await prisma.stylist.create({
    data: {
      name: 'Mathujan',
      gender: 'Male',
      specialization: 'Master Hair Stylist & Hair Coloring Expert',
      status: 'Active',
    },
  });

  const stylist2 = await prisma.stylist.create({
    data: {
      name: 'Mayoori',
      gender: 'Female',
      specialization: 'Bridal Makeup Artist & Skin Care Specialist',
      status: 'Active',
    },
  });

  const stylist3 = await prisma.stylist.create({
    data: {
      name: 'Rishikesan',
      gender: 'Male',
      specialization: 'Senior Barber & Beard Grooming Specialist',
      status: 'Active',
    },
  });
  console.log(`✅ Stylists seeded (3 stylists): ${stylist1.name}, ${stylist2.name}, ${stylist3.name}`);

  // 6. Services (Linked to Admin)
  const service1 = await prisma.service.create({
    data: {
      service_name: 'Classic Haircut & Wash',
      description: 'Precision scissor haircut with wash, blow-dry and styling',
      price: 1500.0,
      gender: 'Male',
      duration: 30,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
      admin_id: adminId,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      service_name: 'Royal Beard Grooming & Hot Towel',
      description: 'Luxury beard shape-up with hot towel treatment and organic oil',
      price: 800.0,
      gender: 'Male',
      duration: 20,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
      admin_id: adminId,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      service_name: 'Bridal Radiance Glow Facial',
      description: 'Deep cleansing, gentle exfoliation, gold glow mask for glowing skin',
      price: 6500.0,
      gender: 'Female',
      duration: 60,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881',
      admin_id: adminId,
    },
  });

  const service4 = await prisma.service.create({
    data: {
      service_name: 'Keratin Hair Spa & Treatment',
      description: 'Intense moisture repair and smoothness for damaged hair',
      price: 4500.0,
      gender: 'Unisex',
      duration: 45,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
      admin_id: adminId,
    },
  });
  console.log('✅ Services seeded (4 services)');

  // 7. Offers & Promotions (Linked to Admin)
  await prisma.offer.createMany({
    data: [
      {
        title: 'WOW Festive 15% OFF',
        description: 'Enjoy 15% off on all Premium Hair Spa and Facial treatments',
        discount: 15.0,
        start_date: new Date('2026-10-01'),
        end_date: new Date('2026-10-31'),
        status: 'Active',
        admin_id: adminId,
      },
      {
        title: 'New Customer Welcome 20% OFF',
        description: 'Exclusive 20% discount on your first appointment booking across all salon services',
        discount: 20.0,
        start_date: new Date('2026-10-01'),
        end_date: new Date('2026-12-31'),
        status: 'Active',
        admin_id: adminId,
      },
      {
        title: 'Bridal Glam Season 25% OFF',
        description: 'Special 25% discount on Bridal Radiance Glow Facial and bridal makeup packages',
        discount: 25.0,
        start_date: new Date('2026-10-15'),
        end_date: new Date('2026-11-30'),
        status: 'Active',
        admin_id: adminId,
      },
      {
        title: 'Midweek Grooming Special 10% OFF',
        description: 'Enjoy 10% discount on Haircuts and Beard Grooming on Tuesday through Thursday',
        discount: 10.0,
        start_date: new Date('2026-10-01'),
        end_date: new Date('2026-11-15'),
        status: 'Active',
        admin_id: adminId,
      },
    ],
  });
  console.log('✅ Offers seeded (4 offers)');

  // 8. Working Hours (Linked to Admin)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of days) {
    await prisma.workingHours.create({
      data: {
        day,
        opening_time: new Date('2026-01-01T09:00:00Z'),
        closing_time: new Date('2026-01-01T20:00:00Z'),
        status: day === 'Sunday' ? 'Short Hours' : 'Open',
        admin_id: adminId,
      },
    });
  }
  console.log('✅ Working hours seeded (7 days)');

  // 9. Breaks (Linked to Admin)
  await prisma.break.create({
    data: {
      day: 'All Days',
      start_time: new Date('2026-01-01T13:00:00Z'),
      end_time: new Date('2026-01-01T14:00:00Z'),
      reason: 'Staff Lunch Break',
      status: 'Active',
      admin_id: adminId,
    },
  });

  // 10. Unavailable Date (Linked to Admin)
  await prisma.unavailableDate.create({
    data: {
      date: new Date('2026-10-25'),
      reason: 'Vap Full Moon Poya Day Holiday',
      status: 'Closed',
      admin_id: adminId,
    },
  });

  // 11. Time Slots (Linked to Admin)
  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist1.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T10:00:00Z'),
      end_time: new Date('2026-10-15T10:30:00Z'),
      status: 'Booked',
      admin_id: adminId,
    },
  });

  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist1.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T11:00:00Z'),
      end_time: new Date('2026-10-15T11:30:00Z'),
      status: 'Available',
      admin_id: adminId,
    },
  });

  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist2.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T10:00:00Z'),
      end_time: new Date('2026-10-15T11:00:00Z'),
      status: 'Available',
      admin_id: adminId,
    },
  });

  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist2.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T11:30:00Z'),
      end_time: new Date('2026-10-15T12:30:00Z'),
      status: 'Available',
      admin_id: adminId,
    },
  });

  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist3.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T14:00:00Z'),
      end_time: new Date('2026-10-15T14:30:00Z'),
      status: 'Available',
      admin_id: adminId,
    },
  });

  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist3.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T15:00:00Z'),
      end_time: new Date('2026-10-15T15:30:00Z'),
      status: 'Available',
      admin_id: adminId,
    },
  });
  console.log('✅ Time slots seeded for all stylists');

  // 12. Sample Appointment
  await prisma.appointment.create({
    data: {
      customer_id: customerUser.customer!.customer_id,
      service_id: service1.service_id,
      stylist_id: stylist1.stylist_id,
      date: new Date('2026-10-15'),
      time: new Date('2026-10-15T10:00:00Z'),
      status: 'Confirmed',
    },
  });
  console.log('✅ Sample Appointment seeded');

  console.log('\n🎉 ALL 13 TABLES SEEDED WITH REALISTIC DATA FOR SALON WOW!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());