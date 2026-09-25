<div align="center">

# 💈 Salon WOW: Smart Salon Appointment and Management System

### *"Unlock your best look"*

[![Project Status](https://img.shields.io/badge/Status-Development%20in%20Progress-F59E0B?style=for-the-badge&logo=git&logoColor=white)](https://github.com/Rishikesan05/SALON-WOW-App-Development)
[![Academic Project](https://img.shields.io/badge/Course-IS5109%20Community%20Project-111111?style=for-the-badge&logo=googlescholar&logoColor=white)](https://www.sab.ac.lk/)
[![University](https://img.shields.io/badge/SUSL-Faculty%20of%20Computing-0052CC?style=for-the-badge)](https://www.sab.ac.lk/computing/)

<br/>

[![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=flat-square&logo=Flutter&logoColor=white)](https://flutter.dev/)
[![Dart](https://img.shields.io/badge/Dart-%230175C2.svg?style=flat-square&logo=dart&logoColor=white)](https://dart.dev/)
[![Riverpod](https://img.shields.io/badge/State_Management-Riverpod-00599C?style=flat-square)](https://riverpod.dev/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-%23E0234E.svg?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-%23316192.svg?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Database_Host-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Render](https://img.shields.io/badge/Backend_Host-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20API-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![FCM](https://img.shields.io/badge/Notifications-Firebase_FCM-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Google Maps](https://img.shields.io/badge/Location-Google_Maps-4285F4?style=flat-square&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Application Experiences](#-application-experiences)
- [Key Features](#-key-features)
  - [Customer Experience](#-customer-experience)
  - [Admin Experience](#-admin-experience)
  - [AI Hair Recommend](#-ai-hair-recommend)
- [Technology Stack](#-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Design System](#-design-system)
- [Project Status](#-project-status)
- [Development Team](#-development-team)
- [Project Information](#-project-information)

---

## 📖 Overview

**Salon WOW: Smart Salon Appointment and Management System** is a mobile-based appointment scheduling and operations management platform engineered specifically for **Salon WOW** in Pambahinna, Ratnapura, Sri Lanka.

Conceived and executed as an academic community project for the **IS5109 Community Project** module at the **Sabaragamuwa University of Sri Lanka**, this solution transitions traditional walk-in and phone-based booking workflows into an intelligent, digitized ecosystem.

> [!NOTE]
> **Single Unified App Architecture:** Both **Customer** and **Admin** personas are unified within a single Flutter mobile application, eliminating the need for a separate web dashboard and granting the salon administration full operational control directly from mobile devices.

---

## 📱 Application Experiences

The mobile solution delivers two specialized, role-based workflows driven by role-based access control (RBAC):

```
┌────────────────────────────────────────────────────────┐
│            SALON WOW MOBILE APPLICATION                │
│                 (Flutter + Riverpod)                   │
├──────────────────────────┬─────────────────────────────┤
│   👤 Customer Experience │    🛠️ Admin Experience      │
│  ─────────────────────── │   ────────────────────────  │
│  • Intuitive self-booking│   • Real-time schedule grid │
│  • Live slot availability│   • Booking status actions  │
│  • AI Hairstyle advisor  │   • Service & offer control │
│  • WOW Points loyalty    │   • Staff & break rosters   │
└──────────────────────────┴─────────────────────────────┘
```

---

## ✨ Key Features

### 👤 Customer Experience

Designed for effortless discovery, convenience, and elevated client engagement:

- **Customer Registration & Login:** Simple and rapid onboarding for new and returning clients.
- **OTP Verification:** One-time password verification safeguarding authentication and bookings.
- **View Salon Information:** Explore salon profiles, facilities, working hours, and contact details.
- **View Services & Prices:** Transparent service catalogs with categorized pricing, durations, and descriptions.
- **View Offers:** Access seasonal campaigns, exclusive packages, and promotional pricing.
- **Make Appointments:** Seamless multi-service booking workflows with customized preferences.
- **Select Date & Time:** Interactive date picker with dynamically calculated real-time available time slots.
- **View Appointment Details:** Comprehensive breakdown of upcoming appointments and instructions.
- **Cancel Appointments:** Client-driven appointment cancellation within designated salon policy periods.
- **Reschedule Appointments:** Intuitive slot-shifting when personal schedules change.
- **Appointment History:** Detailed archive of past visits, chosen styles, and receipts.
- **Notifications:** Timely push notifications for confirmations, upcoming reminders, and updates.
- **WOW Points:** Automated loyalty rewards program to accumulate points and redeem on future visits.
- **Profile Management:** Manage personal preferences, contact numbers, and avatars.
- **Settings:** Tailor notification preferences and application configurations.
- **AI Hair Recommend:** Multimodal generative AI styling assistance.

---

### 🛠️ Admin Experience

A full-fledged mobile management suite enabling salon owners and managers to govern day-to-day operations:

- **Admin Login:** Secure role-based gateway providing elevated managerial rights.
- **Dashboard:** High-level executive overview of daily bookings, revenue indicators, and customer trends.
- **Appointment Management:** Centralized hub for tracking all incoming, confirmed, and ongoing appointments.
- **Accept, Reject, Cancel & Complete Appointments:** Full lifecycle status controls with real-time customer updates.
- **Reschedule Appointments:** Dynamic reallocation of appointment slots to balance stylist loads.
- **Service Management:** Add, modify, categorize, price, and toggle availability of salon services.
- **Offer Management:** Launch, adjust, and retire marketing campaigns and special discount packages.
- **Working Hours Management:** Configure business start and end times for regular weekdays and weekends.
- **Break Management:** Schedule lunch hours, technical pauses, and operational intervals without booking conflicts.
- **Unavailable Date Management:** Set blackout periods for national holidays, staff retreats, and emergency closures.
- **Time Slot Management:** Tune slot duration increments, concurrency limits, and booking buffers.
- **Stylist Management:** Maintain stylist records, availability statuses, specialties, and assigned appointments.
- **Customer Management:** Directory of salon clients, engagement histories, and visit records.
- **WOW Points Management:** Configure loyalty conversion rules, adjust point balances, and oversee redemptions.
- **Salon Information Management:** Update addresses, phone numbers, policy notes, and general announcements.
- **Notification Management:** Broadcast important updates, announcements, and direct alerts to registered clients.

---

### 🤖 AI Hair Recommend

The **AI Hair Recommend** engine integrates Google's **Gemini API** directly into the customer styling journey:

```
[ Customer Selfie / Photo ]
            │
            ▼
[ Gemini Multimodal API Analysis ] ──> (Evaluates facial geometry, hair texture & density)
            │
            ▼
[ Tailored Style Recommendations ] ──> (Visual inspiration & cut/treatment suggestions)
            │
            ▼
[ Direct Salon Service Link ]      ──> (Maps suggestion to matching Salon WOW service)
            │
            ▼
[ Instant Appointment Booking ]    ──> (Select date, time, and confirmed appointment)
```

1. **Photo Upload:** Customers take or upload a front-facing portrait photo in the mobile app.
2. **Generative Style Recommendation:** The Gemini API analyzes facial proportions, hair characteristics, and current styling trends to suggest flattering, modern hairstyles.
3. **End-to-End Booking Connection:** Each recommended hairstyle is seamlessly paired with the corresponding Salon WOW service, allowing the client to book an appointment for that exact style in a single flow.

---

## 🛠️ Technology Stack

| Area | Technology | Purpose & Architectural Justification |
|---|---|---|
| **Mobile Application** | Flutter, Dart | High-performance, cross-platform mobile framework delivering native 60fps UX |
| **State Management** | Riverpod | Compile-safe, declarative, and easily testable reactive state management |
| **Backend** | NestJS, TypeScript, Node.js | Scalable, modular enterprise-grade architecture with strict dependency injection |
| **API** | REST API, JSON | Predictable, well-documented HTTP contract for mobile-backend synchronization |
| **Database** | PostgreSQL | Enterprise-grade relational database guaranteeing transactional ACID integrity |
| **ORM** | Prisma | Type-safe database access layer, intuitive migrations, and automated query builder |
| **Database Hosting** | Supabase | Managed cloud PostgreSQL instance with automated backups and security |
| **Backend Hosting** | Render | Automated CI/CD deployment platform for cloud container execution |
| **Authentication** | JWT, Refresh Tokens | Stateless token pairs ensuring seamless session continuity and strict revocation |
| **Password Security** | Argon2id | Modern, memory-hard hashing algorithm resistant to GPU-accelerated attacks |
| **Authorization** | RBAC | Role-Based Access Control enforcing strict Customer and Admin boundary checks |
| **Notifications** | Firebase Cloud Messaging (FCM) | Low-latency, reliable background and foreground push notification delivery |
| **Image Storage** | Cloudinary | CDN-backed cloud media storage with on-the-fly image optimization |
| **Maps** | Google Maps Platform | Accurate salon geolocation rendering, directions, and customer distance queries |
| **AI** | Gemini API | Multimodal generative vision capabilities powering personalized hairstyle suggestions |
| **Testing** | Flutter Test, Jest, Postman | Multi-tier validation spanning unit tests, backend controllers, and integration contracts |
| **Version Control** | Git, GitHub | Distributed version control with pull request reviews and Git branch governance |
| **Design** | Figma | Interactive wireframing, high-fidelity prototypes, and component design tokens |
| **CI/CD** | GitHub Actions | Automated build checks, test runners, and continuous delivery workflows |
| **Monitoring** | Sentry | Real-time crash diagnostics, unhandled exception tracking, and performance metrics |

---

## 🏗️ Architecture Overview

The diagram below represents the system architecture, illustrating the end-to-end data flow from the single mobile application through the API layer to the backend services, relational database, and supporting cloud integrations:

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (Single Mobile App)"]
        FlutterApp["Flutter Mobile Application<br/><b>Dart + Riverpod</b><br/><i>(Unified Customer & Admin Experiences)</i>"]
    end

    subgraph TransportLayer ["Network & Transport"]
        API["HTTPS / REST API / JSON"]
    end

    subgraph BackendHosting ["Backend Hosting: Render"]
        Server["NestJS Application Service<br/><b>TypeScript + Node.js</b>"]
        ORM["Prisma ORM Client"]
    end

    subgraph DatabaseHosting ["Database Hosting: Supabase"]
        DB[("PostgreSQL Database")]
    end

    subgraph SupportingServices ["Supporting Cloud & AI Ecosystem"]
        FCM["Firebase Cloud Messaging<br/><i>Push Notifications</i>"]
        Maps["Google Maps Platform<br/><i>Location & Navigation</i>"]
        Cloudinary["Cloudinary<br/><i>Media & Image Storage</i>"]
        Gemini["Gemini API<br/><i>AI Hair Recommend</i>"]
    end

    FlutterApp -->|Auth & Feature Requests| API
    API --> Server
    Server --> ORM
    ORM --> DB

    Server -.->|Dispatch Notifications| FCM
    Server -.->|Media Upload & Retrieval| Cloudinary
    Server -.->|Multimodal Style Analysis| Gemini
    FlutterApp -.->|Embedded Map & Coordinates| Maps
```

---

## 🎨 Design System

**Brand:** Salon WOW  
**Tagline:** *"Unlock your best look"*  
**Salon Type:** Unisex Salon  

The design system is constructed around an elegant, gender-neutral aesthetic that combines modern minimalism with warm salon craftsmanship.

### Colour Palette

| Role | Colour | HEX | Intended Application |
|---|---|:---:|---|
| **Primary** | **Matte Black** | `#111111` | Primary brand identity, dark headers, high-contrast typography, deep navigation elements, and framing to establish a sleek, premium foundation. |
| **Secondary / Surface** | **Ceramic Stone** | `#F4F4F2` | Clean background canvas, surface cards, soft module borders, and neutral contrast zones ensuring maximum readability and visual softness. |
| **Tertiary / Accent** | **Warm Amber Wood** | `#DE9D2E` | High-impact call-to-actions, booking buttons, status highlights, badge markers, and WOW Points indicators—evoking natural timber and salon luxury. |

---

## 🚧 Project Status

```
Status: 🚧 Development in Progress
Phase : Initial System Architecture & Foundation
```

This project is actively maintained and developed under the academic curriculum of **IS5109 - Community Project** at the **Sabaragamuwa University of Sri Lanka**.

---

## 👥 Development Team

| Student ID | Name |
|:---:|---|
| **22FIS0584** | S. Rishikesan |
| **22FIS0520** | M.M.F. Musfira |
| **22FIS0560** | C. Thinushanth |
| **22FIS0583** | V. Mathujan |
| **22FIS0585** | E. Mayoori |
| **22FIS0470** | R.W.A.D.L. Anuradha |

### Academic Supervisor

**Mr. K.P.D.P. Patabandi**  
Lecturer  
Department of Computing and Information Systems  
Faculty of Computing  
Sabaragamuwa University of Sri Lanka  

---

## 📌 Project Information

- **Module:** IS5109 - Community Project
- **Institution:** Sabaragamuwa University of Sri Lanka
- **Faculty:** Faculty of Computing
- **Department:** Department of Computing and Information Systems
- **Client / Stakeholder:** Salon WOW
- **Location:** Pambahinna, Ratnapura, Sri Lanka
- **Repository:** [Rishikesan05/SALON-WOW-App-Development](https://github.com/Rishikesan05/SALON-WOW-App-Development)
