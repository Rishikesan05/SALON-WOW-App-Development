import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

// ─── Relative Date Helpers (Asia/Colombo) ────────────────────────────────────
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

function getRelativeDate(dayOffset: number): Date {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  return d;
}

function getRelativeDateTime(dayOffset: number, hours: number, minutes: number = 0): Date {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

async function main() {
  console.log('🌱 ==============================================================================');
  console.log('🌱 Starting Idempotent Database Seed for WOW Salon...');
  console.log(`🌱 Reference "Today": ${today.toISOString().split('T')[0]}`);
  console.log('🌱 ==============================================================================\n');

  // Pre-hash sample password for all demo accounts
  const demoPasswordHash = await bcrypt.hash('Wow@12345', 10);

  // ─── 1. Clean existing demo data safely for idempotency ─────────────────────
  console.log('🧹 Cleaning existing demo rows for idempotent execution...');
  const demoEmails = [
    'admin@wowsalon.lk',
    'admin@salonwow.com',
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
  ];

  const demoPhones = [
    '0771234567',
    '0772345678',
    '0773456789',
    '0774567890',
    '0715678901',
    '0716789012',
    '0717890123',
    '0761122334',
    '0762233445',
    '0763344556',
    '0764455667',
  ];

  const existingDemoUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { in: demoEmails } },
        { phone: { in: demoPhones } },
      ],
    },
    select: { user_id: true },
  });
  const demoUserIds = existingDemoUsers.map((u) => u.user_id);

  if (demoUserIds.length > 0) {
    // Delete relational child tables first
    await prisma.appointmentService.deleteMany();
    await prisma.loyaltyTransaction.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.hairstyleRecommendation.deleteMany();
    await prisma.deviceToken.deleteMany();
    await prisma.stylistService.deleteMany();
    await prisma.offerService.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.break.deleteMany();
    await prisma.unavailableDate.deleteMany();
    await prisma.workingHours.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.service.deleteMany();
    await prisma.salonSettings.deleteMany();
    await prisma.loyalty.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.stylist.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany({
      where: { user_id: { in: demoUserIds } },
    });
  }

  // ─── 2. Users + Profiles (Admin, Customers, Stylists) ───────────────────────
  console.log('👤 Seeding Users & Profiles...');

  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Pubudu Harshana (Admin)',
      email: 'admin@wowsalon.lk',
      phone: '0771234567',
      password_hash: demoPasswordHash,
      role: Role.ADMIN,
      admin: {
        create: {
          admin_username: 'wowadmin',
        },
      },
    },
    include: { admin: true },
  });
  const adminId = adminUser.admin!.admin_id;

  // 6 Customers (3 Female, 3 Male)
  const customerConfigs = [
    { name: 'Dilani Perera', email: 'dilani@gmail.com', phone: '0772345678', gender: 'Female' },
    { name: 'Sanduni Fernando', email: 'sanduni@gmail.com', phone: '0773456789', gender: 'Female' },
    { name: 'Kaveesha Jayawardena', email: 'kaveesha@gmail.com', phone: '0774567890', gender: 'Female' },
    { name: 'Kasun Silva', email: 'kasun@gmail.com', phone: '0715678901', gender: 'Male' },
    { name: 'Nuwan Rajapaksha', email: 'nuwan@gmail.com', phone: '0716789012', gender: 'Male' },
    { name: 'Tharindu De Silva', email: 'tharindu@gmail.com', phone: '0717890123', gender: 'Male' },
  ];

  const customers: any[] = [];
  for (const c of customerConfigs) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        password_hash: demoPasswordHash,
        role: Role.CUSTOMER,
        customer: {
          create: {
            gender: c.gender,
            profile_picture: `https://images.unsplash.com/photo-${c.gender === 'Female' ? '1494790108377-be9c29b29330' : '1507003211169-0a1dd7228f2d'}?w=150`,
            loyalty: {
              create: {
                points: 0,
                reward_info: 'Bronze',
              },
            },
          },
        },
      },
      include: {
        customer: {
          include: { loyalty: true },
        },
      },
    });
    customers.push(user.customer!);
  }

  // 2 Stylists: Mr. Pubudu (Male) and Mrs. Pubudu (Female)
  const stylistConfigs = [
    { name: 'Mrs. Pubudu', email: 'mrs.pubudu@wowsalon.lk', phone: '0762233445', gender: 'Female', spec: 'Senior Hair Stylist & Bridal Specialist' },
    { name: 'Mr. Pubudu', email: 'pubudu@wowsalon.lk', phone: '0763344556', gender: 'Male', spec: "Master Barber & Men's Grooming Specialist" },
  ];

  const stylists: any[] = [];
  for (const s of stylistConfigs) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        phone: s.phone,
        password_hash: demoPasswordHash,
        role: Role.STYLIST,
        stylist: {
          create: {
            name: s.name,
            gender: s.gender,
            specialization: s.spec,
            status: 'Active',
          },
        },
      },
      include: { stylist: true },
    });
    stylists.push(user.stylist!);
  }

  const [mrsPubudu, mrPubudu] = stylists;

  // ─── 3. Services ────────────────────────────────────────────────────────────
  console.log('✂️  Seeding Services...');
  const serviceData = [
    // Female
    { service_name: "Women's Haircut", price: 2500, duration: 45, gender: 'Female', status: 'Active', description: 'Precision layer cut and styling' },
    { service_name: 'Hair Coloring', price: 6500, duration: 120, gender: 'Female', status: 'Active', description: 'Full global hair color or highlights' },
    { service_name: 'Facial', price: 3500, duration: 60, gender: 'Female', status: 'Active', description: 'Deep cleansing and herbal glow facial' },
    { service_name: 'Bridal Makeup', price: 15000, duration: 180, gender: 'Female', status: 'Active', description: 'Complete traditional and modern bridal dressing' },
    { service_name: 'Hair Wash & Blow Dry', price: 1500, duration: 30, gender: 'Female', status: 'Active', description: 'Rejuvenating wash and blow dry styling' },
    // Male
    { service_name: "Men's Haircut", price: 1200, duration: 30, gender: 'Male', status: 'Active', description: 'Classic or contemporary gentlemen cut' },
    { service_name: 'Beard Trim', price: 800, duration: 20, gender: 'Male', status: 'Active', description: 'Hot towel beard shaping and trim' },
    { service_name: 'Hair Wash', price: 700, duration: 15, gender: 'Male', status: 'Active', description: 'Cleansing conditioning hair wash' },
    { service_name: 'Hair Styling', price: 1000, duration: 20, gender: 'Male', status: 'Active', description: 'Matte wax or gel professional styling' },
    // Unisex
    { service_name: 'Head Massage', price: 1500, duration: 30, gender: 'Unisex', status: 'Active', description: 'Stress relief Ayurvedic head and neck massage' },
    { service_name: 'Hair Treatment', price: 4500, duration: 60, gender: 'Unisex', status: 'Active', description: 'Intensive argan oil nourishing hair spa' },
    // Inactive Service (testing deactivated state)
    { service_name: 'Keratin Smoothing', price: 12000, duration: 120, gender: 'Unisex', status: 'Inactive', description: 'Specialized frizz control treatment' },
  ];

  const serviceMap = new Map<string, any>();
  for (const s of serviceData) {
    const service = await prisma.service.create({
      data: {
        service_name: s.service_name,
        price: s.price,
        duration: s.duration,
        gender: s.gender,
        status: s.status,
        description: s.description,
        admin_id: adminId,
      },
    });
    serviceMap.set(s.service_name, service);
  }

  // ─── 4. Stylist Services Junction ───────────────────────────────────────────
  console.log('💇 Seeding Stylist-Service Capabilities...');
  const femaleServices = ["Women's Haircut", 'Hair Coloring', 'Facial', 'Bridal Makeup', 'Hair Wash & Blow Dry'];
  const unisexServices = ['Head Massage', 'Hair Treatment'];
  const maleServices = ["Men's Haircut", 'Beard Trim', 'Hair Wash', 'Hair Styling'];

  // Mrs. Pubudu: All Female + Unisex services
  for (const name of [...femaleServices, ...unisexServices]) {
    await prisma.stylistService.create({
      data: { stylist_id: mrsPubudu.stylist_id, service_id: serviceMap.get(name)!.service_id },
    });
  }

  // Mr. Pubudu: All Male + Unisex services
  for (const name of [...maleServices, ...unisexServices]) {
    await prisma.stylistService.create({
      data: { stylist_id: mrPubudu.stylist_id, service_id: serviceMap.get(name)!.service_id },
    });
  }

  // ─── 5. Salon Settings ──────────────────────────────────────────────────────
  console.log('⚙️  Seeding Salon Settings...');
  await prisma.salonSettings.create({
    data: {
      salon_name: 'WOW Salon',
      address: '123 Galle Road, Colombo 03, Sri Lanka',
      contact_details: '011-2345678 / info@wowsalon.lk',
      location: 'https://maps.google.com/?q=6.8970,79.8562',
      admin_id: adminId,
      reschedule_min_minutes: 60,
      pending_hold_minutes: 30,
      slot_interval_minutes: 30,
      points_per_100_lkr: 10,
    },
  });

  // ─── 6. Working Hours, Breaks & Unavailable Dates ───────────────────────────
  console.log('⏰ Seeding Schedules, Breaks & Unavailable Dates...');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (const day of daysOfWeek) {
    await prisma.workingHours.create({
      data: {
        day,
        opening_time: getRelativeDateTime(0, 9, 0),
        closing_time: getRelativeDateTime(0, 19, 0),
        status: 'Open',
        admin_id: adminId,
        stylist_id: null, // Salon-wide
      },
    });

    // Salon-wide daily lunch break (13:00 - 14:00)
    await prisma.break.create({
      data: {
        day,
        start_time: getRelativeDateTime(0, 13, 0),
        end_time: getRelativeDateTime(0, 14, 0),
        reason: 'Lunch Break',
        status: 'Active',
        admin_id: adminId,
        stylist_id: null,
      },
    });

    // Stylist-specific break: Mr. Pubudu 16:00 - 16:30 daily
    await prisma.break.create({
      data: {
        day,
        start_time: getRelativeDateTime(0, 16, 0),
        end_time: getRelativeDateTime(0, 16, 30),
        reason: 'Evening Tea Break',
        status: 'Active',
        admin_id: adminId,
        stylist_id: mrPubudu.stylist_id,
      },
    });
  }

  // Sunday Closed (Salon-wide)
  await prisma.workingHours.create({
    data: {
      day: 'Sunday',
      opening_time: getRelativeDateTime(0, 9, 0),
      closing_time: getRelativeDateTime(0, 14, 0),
      status: 'Closed',
      admin_id: adminId,
      stylist_id: null,
    },
  });

  // Salon-wide closure holiday (+10 days)
  await prisma.unavailableDate.create({
    data: {
      date: getRelativeDate(10),
      reason: 'National Holiday Closure',
      status: 'Closed',
      admin_id: adminId,
      stylist_id: null,
    },
  });

  // Stylist leave day: Mrs. Pubudu (+3 days)
  await prisma.unavailableDate.create({
    data: {
      date: getRelativeDate(3),
      reason: 'Personal Leave',
      status: 'Closed',
      admin_id: adminId,
      stylist_id: mrsPubudu.stylist_id,
    },
  });

  // ─── 7. Offers & Offer Services ─────────────────────────────────────────────
  console.log('🏷️  Seeding Offers & Promotions...');
  const offerFestive = await prisma.offer.create({
    data: {
      title: 'Festive Sparkle',
      description: 'Enjoy 15% discount on all salon services this festival season!',
      discount: 15.0,
      discount_type: 'PERCENTAGE',
      usage_limit: 100,
      usage_count: 24,
      start_date: getRelativeDate(0),
      end_date: getRelativeDate(30),
      status: 'Active',
      admin_id: adminId,
    },
  });

  await prisma.offer.create({
    data: {
      title: 'Weekday Rs.500 Off',
      description: 'Save Rs.500 on total billing of Rs.3,000 or more on weekdays.',
      discount: 500.0,
      discount_type: 'FIXED_AMOUNT',
      minimum_spend: 3000.0,
      start_date: getRelativeDate(0),
      end_date: getRelativeDate(60),
      status: 'Active',
      admin_id: adminId,
    },
  });

  const groomComboOffer = await prisma.offer.create({
    data: {
      title: 'Groom Combo',
      description: "Men's Haircut + Hair Wash + Hair Styling for only Rs. 2,200 (Save Rs. 700)",
      discount: 700.0,
      discount_type: 'FIXED_COMBO_PRICE',
      start_date: getRelativeDate(0),
      end_date: getRelativeDate(45),
      status: 'Active',
      admin_id: adminId,
    },
  });

  // Link Groom Combo services
  for (const sName of ["Men's Haircut", 'Hair Wash', 'Hair Styling']) {
    await prisma.offerService.create({
      data: {
        offer_id: groomComboOffer.offer_id,
        service_id: serviceMap.get(sName)!.service_id,
      },
    });
  }

  const ladiesGlowOffer = await prisma.offer.create({
    data: {
      title: 'Ladies Glow Combo',
      description: "Women's Haircut + Facial + Hair Wash & Blow Dry for Rs. 7,500 (Save Rs. 500)",
      discount: 500.0,
      discount_type: 'FIXED_COMBO_PRICE',
      start_date: getRelativeDate(0),
      end_date: getRelativeDate(45),
      status: 'Active',
      admin_id: adminId,
    },
  });

  // Link Ladies Glow Combo services
  for (const sName of ["Women's Haircut", 'Facial', 'Hair Wash & Blow Dry']) {
    await prisma.offerService.create({
      data: {
        offer_id: ladiesGlowOffer.offer_id,
        service_id: serviceMap.get(sName)!.service_id,
      },
    });
  }

  // Expired offer
  await prisma.offer.create({
    data: {
      title: 'New Year Blast',
      description: 'Exclusive 20% discount celebrating the New Year.',
      discount: 20.0,
      discount_type: 'PERCENTAGE',
      start_date: getRelativeDate(-60),
      end_date: getRelativeDate(-30),
      status: 'Expired',
      admin_id: adminId,
    },
  });

  // ─── 8. Appointments & Snapshot Services ────────────────────────────────────
  console.log('📅 Seeding Realistic Appointments & Snapshot Services...');

  // Helper to create an appointment with snapshot service rows
  async function createFullAppointment(params: {
    customer: any;
    stylist: any;
    date: Date;
    time: Date;
    services: any[];
    status: string;
    offer?: any;
    customTotalPrice?: number;
    stylist_type?: string;
    approved_by_id?: number | null;
    approved_at?: Date | null;
    cancelled_at?: Date | null;
    cancellation_reason?: string | null;
    rescheduled_from_id?: number | null;
    admin_notes?: string | null;
    customer_notes?: string | null;
    created_date?: Date;
  }) {
    const totalDuration = params.services.reduce((acc, s) => acc + s.duration, 0);
    const standardTotalPrice = params.services.reduce((acc, s) => acc + Number(s.price), 0);
    const finalTotalPrice = params.customTotalPrice !== undefined ? params.customTotalPrice : standardTotalPrice;
    const endTime = new Date(params.time.getTime() + totalDuration * 60 * 1000);

    const app = await prisma.appointment.create({
      data: {
        customer_id: params.customer.customer_id,
        service_id: params.services[0].service_id, // Primary service reference
        stylist_id: params.stylist.stylist_id,
        date: params.date,
        time: params.time,
        end_time: endTime,
        total_price: finalTotalPrice,
        offer_id: params.offer ? params.offer.offer_id : null,
        stylist_type: params.stylist_type || 'Specific',
        status: params.status,
        customer_notes: params.customer_notes || null,
        admin_notes: params.admin_notes || null,
        approved_by_id: params.approved_by_id || null,
        approved_at: params.approved_at || null,
        cancelled_at: params.cancelled_at || null,
        cancellation_reason: params.cancellation_reason || null,
        rescheduled_from_id: params.rescheduled_from_id || null,
        created_date: params.created_date || new Date(),
        appointment_services: {
          create: params.services.map((s) => ({
            service_id: s.service_id,
            service_name: s.service_name,
            duration_mins: s.duration,
            unit_price: s.price,
          })),
        },
      },
      include: {
        appointment_services: true,
      },
    });
    return app;
  }

  // --- Tomorrow (Day +1) Appointments ---
  // 7a. Female customer 1 + Mrs. Pubudu, 10:00, Women's Haircut + Wash & Blow Dry (75m), CONFIRMED
  const app7a = await createFullAppointment({
    customer: customers[0], // Dilani
    stylist: mrsPubudu,
    date: getRelativeDate(1),
    time: getRelativeDateTime(1, 10, 0),
    services: [serviceMap.get("Women's Haircut")!, serviceMap.get('Hair Wash & Blow Dry')!],
    status: 'CONFIRMED',
    approved_by_id: adminUser.user_id,
    approved_at: now,
    customer_notes: 'Please recommend a style suited for a wedding next week.',
  });

  // 7b. Male customer 1 + Mr. Pubudu, 10:00 (SAME TIME AS 7a!), Groom Combo (65m), CONFIRMED
  const app7b = await createFullAppointment({
    customer: customers[3], // Kasun
    stylist: mrPubudu,
    date: getRelativeDate(1),
    time: getRelativeDateTime(1, 10, 0),
    services: [serviceMap.get("Men's Haircut")!, serviceMap.get('Hair Wash')!, serviceMap.get('Hair Styling')!],
    status: 'CONFIRMED',
    offer: groomComboOffer,
    customTotalPrice: 2200.0,
    approved_by_id: adminUser.user_id,
    approved_at: now,
  });

  // 7c. Female customer 2 + Mrs. Pubudu, 11:30 (after 7a ends at 11:15), Hair Coloring (120m), PENDING
  await createFullAppointment({
    customer: customers[1], // Sanduni
    stylist: mrsPubudu,
    date: getRelativeDate(1),
    time: getRelativeDateTime(1, 11, 30),
    services: [serviceMap.get('Hair Coloring')!],
    status: 'PENDING',
    customer_notes: 'Bringing reference photo for dark caramel ombre.',
  });

  // 7d. Male customer 2 + Mr. Pubudu, 15:00, Men's Haircut + Beard Trim (50m), stylist_type 'ANY', PENDING
  await createFullAppointment({
    customer: customers[4], // Nuwan
    stylist: mrPubudu,
    date: getRelativeDate(1),
    time: getRelativeDateTime(1, 15, 0),
    services: [serviceMap.get("Men's Haircut")!, serviceMap.get('Beard Trim')!],
    status: 'PENDING',
    stylist_type: 'ANY',
  });

  // --- Other Days Appointments ---
  // 7e. Female customer 3, 2 days from now, Facial, CONFIRMED
  await createFullAppointment({
    customer: customers[2], // Kaveesha
    stylist: mrsPubudu,
    date: getRelativeDate(2),
    time: getRelativeDateTime(2, 10, 0),
    services: [serviceMap.get('Facial')!],
    status: 'CONFIRMED',
    approved_by_id: adminUser.user_id,
    approved_at: now,
  });

  // 7f. Male customer 3, 3 days from now, Men's Haircut, REJECTED with admin_notes
  await createFullAppointment({
    customer: customers[5], // Tharindu
    stylist: mrPubudu,
    date: getRelativeDate(3),
    time: getRelativeDateTime(3, 11, 0),
    services: [serviceMap.get("Men's Haircut")!],
    status: 'REJECTED',
    admin_notes: 'Stylist unavailable at requested time slot due to equipment maintenance.',
  });

  // 7g. Female customer 1, yesterday (-1 day), Facial (3500 LKR), COMPLETED
  const app7g = await createFullAppointment({
    customer: customers[0], // Dilani
    stylist: mrsPubudu,
    date: getRelativeDate(-1),
    time: getRelativeDateTime(-1, 14, 0),
    services: [serviceMap.get('Facial')!],
    status: 'COMPLETED',
  });

  // 7h. Male customer 1, 5 days ago (-5 days), Men's Haircut (1200 LKR), COMPLETED
  const app7h = await createFullAppointment({
    customer: customers[3], // Kasun
    stylist: mrPubudu,
    date: getRelativeDate(-5),
    time: getRelativeDateTime(-5, 16, 0),
    services: [serviceMap.get("Men's Haircut")!],
    status: 'COMPLETED',
  });

  // 7i. Female customer 2, 4 days ago (-4 days), Hair Treatment, CANCELLED
  await createFullAppointment({
    customer: customers[1], // Sanduni
    stylist: mrsPubudu,
    date: getRelativeDate(-4),
    time: getRelativeDateTime(-4, 11, 0),
    services: [serviceMap.get('Hair Treatment')!],
    status: 'CANCELLED',
    cancelled_at: getRelativeDateTime(-4, 9, 30),
    cancellation_reason: 'Customer requested cancellation due to personal emergency.',
  });

  // 7j. Male customer 2, 6 days ago (-6 days), Beard Trim, NO_SHOW
  await createFullAppointment({
    customer: customers[4], // Nuwan
    stylist: mrPubudu,
    date: getRelativeDate(-6),
    time: getRelativeDateTime(-6, 14, 0),
    services: [serviceMap.get('Beard Trim')!],
    status: 'NO_SHOW',
    admin_notes: 'Customer did not attend or call ahead.',
  });

  // 7k. Reschedule pair (Old CANCELLED + New PENDING linked via rescheduled_from_id)
  const oldCancelledApp = await createFullAppointment({
    customer: customers[0], // Dilani
    stylist: mrsPubudu,
    date: getRelativeDate(-2),
    time: getRelativeDateTime(-2, 15, 0),
    services: [serviceMap.get('Hair Wash & Blow Dry')!],
    status: 'CANCELLED',
    cancelled_at: getRelativeDateTime(-2, 13, 0),
    cancellation_reason: 'Customer requested reschedule to tomorrow afternoon.',
  });

  await createFullAppointment({
    customer: customers[0],
    stylist: mrsPubudu,
    date: getRelativeDate(1),
    time: getRelativeDateTime(1, 14, 30),
    services: [serviceMap.get('Hair Wash & Blow Dry')!],
    status: 'PENDING',
    rescheduled_from_id: oldCancelledApp.appointment_id,
    customer_notes: 'Rescheduled from appointment #' + oldCancelledApp.appointment_id,
  });

  // Extra: PENDING appointment created 45 mins ago (> 30 min pending hold) to test hold release job
  await createFullAppointment({
    customer: customers[5], // Tharindu
    stylist: mrPubudu,
    date: getRelativeDate(4),
    time: getRelativeDateTime(4, 14, 0),
    services: [serviceMap.get("Men's Haircut")!],
    status: 'PENDING',
    created_date: new Date(Date.now() - 45 * 60 * 1000), // Created 45 mins ago
    customer_notes: 'Slot hold expiration test record (> 30m)',
  });

  // ─── 9. Loyalty & Loyalty Transactions ──────────────────────────────────────
  console.log('💎 Seeding Loyalty Ledger & Points...');

  // Dilani's Loyalty Ledger:
  // 1. EARNED from app7g (Facial: 3500 LKR -> 350 points)
  await prisma.loyaltyTransaction.create({
    data: {
      loyalty_id: customers[0].loyalty.loyalty_id,
      appointment_id: app7g.appointment_id,
      points: 350,
      type: 'EARNED',
      description: 'Points earned from completed appointment #' + app7g.appointment_id,
    },
  });

  // 2. REDEEMED (-100 points)
  await prisma.loyaltyTransaction.create({
    data: {
      loyalty_id: customers[0].loyalty.loyalty_id,
      appointment_id: null,
      points: -100,
      type: 'REDEEMED',
      description: 'Redeemed for Rs. 500 promotional discount voucher',
    },
  });

  // 3. ADJUSTED (+50 points admin bonus)
  await prisma.loyaltyTransaction.create({
    data: {
      loyalty_id: customers[0].loyalty.loyalty_id,
      appointment_id: null,
      points: 50,
      type: 'ADJUSTED',
      description: 'Admin appreciation loyalty bonus',
    },
  });

  // Update Dilani's loyalty total: 350 - 100 + 50 = 300 points, Gold tier
  await prisma.loyalty.update({
    where: { loyalty_id: customers[0].loyalty.loyalty_id },
    data: { points: 300, reward_info: 'Gold' },
  });

  // Kasun's Loyalty Ledger:
  // EARNED from app7h (Men's Haircut: 1200 LKR -> 120 points)
  await prisma.loyaltyTransaction.create({
    data: {
      loyalty_id: customers[3].loyalty.loyalty_id,
      appointment_id: app7h.appointment_id,
      points: 120,
      type: 'EARNED',
      description: 'Points earned from completed appointment #' + app7h.appointment_id,
    },
  });

  await prisma.loyalty.update({
    where: { loyalty_id: customers[3].loyalty.loyalty_id },
    data: { points: 120, reward_info: 'Silver' },
  });

  // ─── 10. Notifications ──────────────────────────────────────────────────────
  console.log('🔔 Seeding System Notifications...');
  // Notifications for Dilani
  await prisma.notification.createMany({
    data: [
      {
        user_id: customers[0].user_id,
        appointment_id: app7a.appointment_id,
        title: 'Booking Confirmed!',
        message: 'Your appointment for tomorrow at 10:00 AM with Mrs. Pubudu has been confirmed.',
        type: 'APPOINTMENT_CONFIRMED',
        is_read: true,
        read_at: now,
        created_at: getRelativeDateTime(0, 10, 15),
      },
      {
        user_id: customers[0].user_id,
        appointment_id: app7g.appointment_id,
        title: '350 WOW Points Earned!',
        message: 'Thank you for visiting WOW Salon! 350 points have been credited to your loyalty balance.',
        type: 'LOYALTY_EARNED',
        is_read: true,
        read_at: now,
        created_at: getRelativeDateTime(-1, 15, 10),
      },
      {
        user_id: customers[0].user_id,
        appointment_id: null,
        title: 'Exclusive Offer for You!',
        message: 'Festive Sparkle offer is now active! Get 15% off on your next booking.',
        type: 'OFFER_PROMOTION',
        is_read: false,
        created_at: getRelativeDateTime(0, 8, 0),
      },
    ],
  });

  // Notifications for Kasun
  await prisma.notification.createMany({
    data: [
      {
        user_id: customers[3].user_id,
        appointment_id: app7b.appointment_id,
        title: 'Groom Combo Confirmed',
        message: 'Your Groom Combo appointment tomorrow at 10:00 AM with Mr. Pubudu is confirmed.',
        type: 'APPOINTMENT_CONFIRMED',
        is_read: true,
        read_at: now,
        created_at: getRelativeDateTime(0, 11, 0),
      },
      {
        user_id: customers[3].user_id,
        appointment_id: null,
        title: 'Welcome to WOW Rewards',
        message: 'You have been awarded Silver membership status.',
        type: 'LOYALTY_TIER',
        is_read: false,
        created_at: getRelativeDateTime(-5, 17, 0),
      },
    ],
  });

  // Notifications for Sanduni (Cancelled)
  await prisma.notification.create({
    data: {
      user_id: customers[1].user_id,
      title: 'Appointment Cancelled',
      message: 'Your Hair Treatment appointment was cancelled upon your request.',
      type: 'APPOINTMENT_CANCELLED',
      is_read: true,
      read_at: getRelativeDateTime(-4, 10, 0),
      created_at: getRelativeDateTime(-4, 9, 35),
    },
  });

  // Notifications for Tharindu (Rejected)
  await prisma.notification.create({
    data: {
      user_id: customers[5].user_id,
      title: 'Appointment Update',
      message: 'Your booking request was declined: Stylist unavailable at requested time slot.',
      type: 'APPOINTMENT_REJECTED',
      is_read: false,
      created_at: getRelativeDateTime(0, 12, 0),
    },
  });

  // 2 Notifications for Admin
  await prisma.notification.createMany({
    data: [
      {
        user_id: adminUser.user_id,
        appointment_id: app7a.appointment_id,
        title: 'New Booking Request',
        message: 'Dilani Perera submitted a booking for Women\'s Haircut + Wash.',
        type: 'ADMIN_NEW_BOOKING',
        is_read: true,
        read_at: now,
        created_at: getRelativeDateTime(0, 9, 0),
      },
      {
        user_id: adminUser.user_id,
        appointment_id: app7b.appointment_id,
        title: 'New Booking Request',
        message: 'Kasun Silva submitted a booking for Groom Combo.',
        type: 'ADMIN_NEW_BOOKING',
        is_read: false,
        created_at: getRelativeDateTime(0, 9, 30),
      },
    ],
  });

  // ─── 11. Hairstyle Recommendations ──────────────────────────────────────────
  console.log('✨ Seeding AI Hairstyle Recommendations...');
  // 1 Active recommendation
  await prisma.hairstyleRecommendation.create({
    data: {
      customer_id: customers[0].customer_id,
      recommendation_data: {
        face_shape: 'Oval',
        skin_tone: 'Warm Golden',
        hair_texture: 'Wavy Medium',
        suggestions: [
          { style: 'Layered Textured Cut', reason: 'Accentuates facial symmetry and natural wave bounce' },
          { style: 'Balayage Caramel Glow', reason: 'Complements warm undertones with subtle sun-kissed contrast' },
        ],
      },
      image_path: 'uploads/recommendations/dilani_oval_style_preview.jpg',
      created_at: getRelativeDateTime(0, 10, 0),
      expires_at: getRelativeDate(30),
    },
  });

  // 1 Expired recommendation (to test daily cleanup cron)
  await prisma.hairstyleRecommendation.create({
    data: {
      customer_id: customers[1].customer_id,
      recommendation_data: {
        face_shape: 'Round',
        skin_tone: 'Cool Rose',
        hair_texture: 'Fine Straight',
        suggestions: [
          { style: 'Long Angled Bob (Lob)', reason: 'Elongates cheekbones and provides slimming structure' },
        ],
      },
      image_path: 'uploads/recommendations/sanduni_expired_style.jpg',
      created_at: getRelativeDateTime(-40, 9, 0),
      expires_at: getRelativeDate(-10), // Expired 10 days ago
    },
  });

  // ─── 12. Device Tokens ──────────────────────────────────────────────────────
  console.log('📱 Seeding Device Push Tokens...');
  await prisma.deviceToken.create({
    data: {
      user_id: customers[0].user_id,
      token: 'fcm_token_dilani_android_2026_xyz789',
      platform: 'ANDROID',
    },
  });

  await prisma.deviceToken.create({
    data: {
      user_id: customers[3].user_id,
      token: 'fcm_token_kasun_android_2026_abc123',
      platform: 'ANDROID',
    },
  });

  // ─── 13. Verification Suite ─────────────────────────────────────────────────
  console.log('\n🔍 ==============================================================================');
  console.log('🔍 Running Verification Assertions...');

  // Assertion 1: Check no stylist has overlapping PENDING or CONFIRMED appointments
  const activeAppointments = await prisma.appointment.findMany({
    where: { status: { in: ['PENDING', 'CONFIRMED'] }, end_time: { not: null } },
    select: { appointment_id: true, stylist_id: true, time: true, end_time: true, status: true },
  });

  for (let i = 0; i < activeAppointments.length; i++) {
    for (let j = i + 1; j < activeAppointments.length; j++) {
      const a = activeAppointments[i];
      const b = activeAppointments[j];
      if (a.stylist_id === b.stylist_id) {
        const overlap = a.time < b.end_time! && b.time < a.end_time!;
        if (overlap) {
          throw new Error(`❌ OVERLAP DETECTED for stylist ${a.stylist_id} between #${a.appointment_id} and #${b.appointment_id}!`);
        }
      }
    }
  }
  console.log('✅ Assertion 1 PASSED: Zero overlapping PENDING/CONFIRMED appointments for any stylist.');

  // Assertion 2: Simultaneous booking test (7a Mrs. Pubudu & 7b Mr. Pubudu share exact start time)
  if (app7a.time.getTime() !== app7b.time.getTime()) {
    throw new Error('❌ SIMULTANEOUS BOOKING CHECK FAILED: 7a and 7b start times do not match!');
  }
  if (app7a.stylist_id === app7b.stylist_id) {
    throw new Error('❌ SIMULTANEOUS BOOKING CHECK FAILED: 7a and 7b share the same stylist!');
  }
  console.log('✅ Assertion 2 PASSED: 7a (Mrs. Pubudu) and 7b (Mr. Pubudu) share exact start time with different stylists.');

  // Assertion 3: Appointment end_time matches start + sum(appointment_services duration)
  const allAppointmentsWithServices = await prisma.appointment.findMany({
    include: { appointment_services: true },
  });

  for (const app of allAppointmentsWithServices) {
    const totalMins = app.appointment_services.reduce((acc, s) => acc + s.duration_mins, 0);
    const expectedEndTime = new Date(app.time.getTime() + totalMins * 60 * 1000);
    if (app.end_time && app.end_time.getTime() !== expectedEndTime.getTime()) {
      throw new Error(`❌ END TIME MISMATCH for appointment #${app.appointment_id}! Expected ${expectedEndTime}, got ${app.end_time}`);
    }
  }
  console.log('✅ Assertion 3 PASSED: Every appointment end_time strictly equals start + sum(services duration).');

  // Assertion 4: Loyalty point balances strictly equal sum of transactions
  const allLoyalties = await prisma.loyalty.findMany({
    include: { transactions: true },
  });

  for (const l of allLoyalties) {
    const sum = l.transactions.reduce((acc, t) => acc + t.points, 0);
    if (l.points !== sum) {
      throw new Error(`❌ LOYALTY LEDGER MISMATCH for loyalty #${l.loyalty_id}! Balance is ${l.points}, ledger sum is ${sum}`);
    }
  }
  console.log('✅ Assertion 4 PASSED: Every customer loyalty balance strictly matches ledger transaction sum.');

  // ─── 14. Table Count Summary ────────────────────────────────────────────────
  console.log('\n📊 ==============================================================================');
  console.log('📊 DATABASE SEED RECORD COUNT SUMMARY:');
  console.log('📊 ==============================================================================');
  const counts = {
    users: await prisma.user.count(),
    admins: await prisma.admin.count(),
    customers: await prisma.customer.count(),
    stylists: await prisma.stylist.count(),
    services: await prisma.service.count(),
    stylist_services: await prisma.stylistService.count(),
    salon_settings: await prisma.salonSettings.count(),
    working_hours: await prisma.workingHours.count(),
    breaks: await prisma.break.count(),
    unavailable_dates: await prisma.unavailableDate.count(),
    offers: await prisma.offer.count(),
    offer_services: await prisma.offerService.count(),
    appointments: await prisma.appointment.count(),
    appointment_services: await prisma.appointmentService.count(),
    loyalty: await prisma.loyalty.count(),
    loyalty_transactions: await prisma.loyaltyTransaction.count(),
    notifications: await prisma.notification.count(),
    hairstyle_recommendations: await prisma.hairstyleRecommendation.count(),
    device_tokens: await prisma.deviceToken.count(),
  };

  console.table(counts);
  console.log('🌱 All demo records successfully seeded and verified without errors! 🚀\n');
}

main()
  .catch((e) => {
    console.error('❌ SEED ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });