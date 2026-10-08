import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Application router configuration.
/// Members will add their feature routes here.
///
/// Route naming convention:
///   /               - Splash / initial route
///   /login          - Login screen
///   /register       - Registration screen
///   /customer/*     - Customer-facing screens
///   /admin/*        - Admin-facing screens
final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  debugLogDiagnostics: true,
  routes: [
    GoRoute(
      path: '/',
      name: 'splash',
      builder: (context, state) => const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '✂️',
                style: TextStyle(fontSize: 64),
              ),
              SizedBox(height: 16),
              Text(
                'Salon WOW',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF111111),
                ),
              ),
              SizedBox(height: 8),
              CircularProgressIndicator(
                color: Color(0xFFDE9D2E),
              ),
            ],
          ),
        ),
      ),
    ),

    // ─── Auth routes will be added by the team ───
    // GoRoute(path: '/login', ...),
    // GoRoute(path: '/register', ...),
    // GoRoute(path: '/otp-verify', ...),

    // ─── Customer routes will be added by the team ───
    // GoRoute(path: '/customer/home', ...),
    // GoRoute(path: '/customer/booking', ...),
    // GoRoute(path: '/customer/appointments', ...),

    // ─── Admin routes will be added by the team ───
    // GoRoute(path: '/admin/dashboard', ...),
    // GoRoute(path: '/admin/appointments', ...),
    // GoRoute(path: '/admin/services', ...),
  ],

  // TODO: Add redirect logic after Auth module is built
  // redirect: (context, state) {
  //   final isLoggedIn = authProvider.isLoggedIn;
  //   final isAdmin = authProvider.role == 'ADMIN';
  //   if (!isLoggedIn) return '/login';
  //   if (isAdmin && state.matchedLocation == '/') return '/admin/dashboard';
  //   if (!isAdmin && state.matchedLocation == '/') return '/customer/home';
  //   return null;
  // },
);
