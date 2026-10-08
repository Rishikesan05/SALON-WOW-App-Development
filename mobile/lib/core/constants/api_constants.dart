/// API configuration constants.
/// Change baseUrl when switching between development and production.
abstract class ApiConstants {
  // ─── Development ───
  // Android emulator uses 10.0.2.2 to reach host machine's localhost.
  // Physical device: use your machine's local IP (e.g., 192.168.x.x).
  static const String baseUrl = 'http://10.0.2.2:3000/api';

  // ─── Production ───
  // Uncomment and use the Render-hosted URL for production builds.
  // static const String baseUrl = 'https://salon-wow-api.onrender.com/api';

  // ─── Timeouts ───
  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
