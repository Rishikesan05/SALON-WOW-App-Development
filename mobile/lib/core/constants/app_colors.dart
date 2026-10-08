import 'package:flutter/material.dart';

/// Centralized color definitions from the Salon WOW design system.
/// All screens must use these constants instead of hardcoded Color values.
abstract class AppColors {
  // ─── Brand Colors ───
  static const Color primary = Color(0xFF111111); // Matte Black
  static const Color secondary = Color(0xFFF4F4F2); // Ceramic Stone
  static const Color accent = Color(0xFFDE9D2E); // Warm Amber Wood

  // ─── Semantic Colors ───
  static const Color error = Color(0xFFDC3545);
  static const Color success = Color(0xFF28A745);
  static const Color warning = Color(0xFFFFC107);
  static const Color info = Color(0xFF17A2B8);

  // ─── Text Colors ───
  static const Color textPrimary = Color(0xFF111111);
  static const Color textSecondary = Color(0xFF6C757D);
  static const Color textLight = Color(0xFFADB5BD);

  // ─── Surface Colors ───
  static const Color cardBackground = Color(0xFFFFFFFF);
  static const Color divider = Color(0xFFE9ECEF);
  static const Color shimmerBase = Color(0xFFE0E0E0);
  static const Color shimmerHighlight = Color(0xFFF5F5F5);
}
