import { PrismaClient } from '@prisma/client';

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

  // 2. Salon Settings
  const salon = await prisma.salonSettings.create({
    data: {
      salon_name: 'WOW Salon',
      address: 'Main Street, Balangoda, Sri Lanka',
      contact_details: '077-1234567 / info@salonwow.lk',
      location: 'https://maps.google.com/?q=6.6508,80.7011',
    },
  });
  console.log('✅ Salon Settings seeded');

  // 3. Admin User
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
  });
  console.log('✅ Admin User seeded:', adminUser.name);

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
      name: 'Kamal Perera',
      gender: 'Male',
      specialization: 'Master Hair Stylist & Colorist',
      status: 'Active',
    },
  });

  const stylist2 = await prisma.stylist.create({
    data: {
      name: 'Nirosha Silva',
      gender: 'Female',
      specialization: 'Skin & Bridal Facial Specialist',
      status: 'Active',
    },
  });

  const stylist3 = await prisma.stylist.create({
    data: {
      name: 'Dineth Fernando',
      gender: 'Male',
      specialization: 'Barber & Beard Grooming Artist',
      status: 'Active',
    },
  });
  console.log('✅ Stylists seeded (3 stylists)');

  // 6. Services
  const service1 = await prisma.service.create({
    data: {
      service_name: 'Classic Haircut & Wash',
      description: 'Precision scissor haircut with wash, blow-dry and styling',
      price: 1500.0,
      gender: 'Male',
      duration: 30,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
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
    },
  });
  console.log('✅ Services seeded (4 services)');

  // 7. Offers & Promotions
  await prisma.offer.create({
    data: {
      title: 'WOW Festive 15% OFF',
      description: 'Enjoy 15% off on all Premium Hair Spa and Facial treatments',
      discount: 15.0,
      start_date: new Date('2026-10-01'),
      end_date: new Date('2026-10-31'),
      status: 'Active',
    },
  });
  console.log('✅ Offers seeded');

  // 8. Working Hours
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of days) {
    await prisma.workingHours.create({
      data: {
        day,
        opening_time: new Date('2026-01-01T09:00:00Z'),
        closing_time: new Date('2026-01-01T20:00:00Z'),
        status: day === 'Sunday' ? 'Short Hours' : 'Open',
      },
    });
  }
  console.log('✅ Working hours seeded (7 days)');

  // 9. Breaks
  await prisma.break.create({
    data: {
      day: 'All Days',
      start_time: new Date('2026-01-01T13:00:00Z'),
      end_time: new Date('2026-01-01T14:00:00Z'),
      reason: 'Staff Lunch Break',
      status: 'Active',
    },
  });

  // 10. Unavailable Date
  await prisma.unavailableDate.create({
    data: {
      date: new Date('2026-10-25'),
      reason: 'Vap Full Moon Poya Day Holiday',
      status: 'Closed',
    },
  });

  // 11. Time Slots
  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist1.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T10:00:00Z'),
      end_time: new Date('2026-10-15T10:30:00Z'),
      status: 'Booked',
    },
  });

  await prisma.timeSlot.create({
    data: {
      stylist_id: stylist1.stylist_id,
      date: new Date('2026-10-15'),
      start_time: new Date('2026-10-15T11:00:00Z'),
      end_time: new Date('2026-10-15T11:30:00Z'),
      status: 'Available',
    },
  });

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
