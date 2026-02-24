import 'package:flutter/material.dart';

class AppColors {
  // Brand gradient
  static const Color primary = Color(0xFF6C63FF);
  static const Color primaryDark = Color(0xFF4B44CC);
  static const Color accent = Color(0xFFFF6B6B);
  static const Color accentGold = Color(0xFFFFB800);

  // Backgrounds
  static const Color bgDark = Color(0xFF0E0E1A);
  static const Color bgDarkCard = Color(0xFF1A1A2E);
  static const Color bgDarkSurface = Color(0xFF16213E);
  static const Color bgLight = Color(0xFFF5F5FF);
  static const Color bgLightCard = Color(0xFFFFFFFF);

  // Text
  static const Color textDark = Color(0xFFF0F0FF);
  static const Color textLight = Color(0xFF1A1A2E);
  static const Color textMuted = Color(0xFF8888AA);

  // Status
  static const Color endingSoon = Color(0xFFFF4757);
  static const Color verified = Color(0xFF2ED573);
  static const Color featured = Color(0xFFFFB800);
}

class AppTheme {
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.bgDark,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.primary,
      secondary: AppColors.accent,
      surface: AppColors.bgDarkCard,
      onPrimary: Colors.white,
      onSurface: AppColors.textDark,
    ),
    fontFamily: 'Inter',
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.bgDark,
      foregroundColor: AppColors.textDark,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        fontFamily: 'Inter',
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.textDark,
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: AppColors.bgDarkCard,
      indicatorColor: AppColors.primary.withOpacity(0.2),
      labelTextStyle: WidgetStateProperty.all(
        const TextStyle(fontFamily: 'Inter', fontSize: 11, fontWeight: FontWeight.w500),
      ),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: AppColors.bgDarkSurface,
      selectedColor: AppColors.primary,
      labelStyle: const TextStyle(fontSize: 13, fontFamily: 'Inter'),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    ),
    cardTheme: CardThemeData(
      color: AppColors.bgDarkCard,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: AppColors.bgLight,
    colorScheme: const ColorScheme.light(
      primary: AppColors.primary,
      secondary: AppColors.accent,
      surface: AppColors.bgLightCard,
      onPrimary: Colors.white,
      onSurface: AppColors.textLight,
    ),
    fontFamily: 'Inter',
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.bgLight,
      foregroundColor: AppColors.textLight,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        fontFamily: 'Inter',
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.textLight,
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: AppColors.bgLightCard,
      indicatorColor: AppColors.primary.withOpacity(0.15),
      labelTextStyle: WidgetStateProperty.all(
        const TextStyle(fontFamily: 'Inter', fontSize: 11, fontWeight: FontWeight.w500),
      ),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: const Color(0xFFEEEEFF),
      selectedColor: AppColors.primary,
      labelStyle: const TextStyle(fontSize: 13, fontFamily: 'Inter'),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    ),
    cardTheme: CardThemeData(
      color: AppColors.bgLightCard,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );
}
