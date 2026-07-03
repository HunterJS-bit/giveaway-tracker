import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
// ignore: depend_on_referenced_packages
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'core/theme/app_theme.dart';
import 'core/providers/providers.dart';
import 'core/router/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await dotenv.load(fileName: ".env");
  
  final prefs = await SharedPreferences.getInstance();

  runApp(
    ProviderScope(
      overrides: [
        sharedPrefsProvider.overrideWithValue(prefs),
      ],
      child: const BalkanGiveawayApp(),
    ),
  );
}

class BalkanGiveawayApp extends ConsumerWidget {
  const BalkanGiveawayApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeModeValue = ref.watch(themeModeProvider);
    final localeValue = ref.watch(localeProvider);
    final prefs = ref.watch(sharedPrefsProvider);

    ThemeMode mode;
    switch (themeModeValue) {
      case 1: mode = ThemeMode.light; break;
      case 2: mode = ThemeMode.dark; break;
      default: mode = ThemeMode.system; break;
    }

    // Convert string locale 'sr_Latn' to actual Locale
    Locale getAppLocale(String loc) {
      if (loc == 'sr_Latn') return const Locale.fromSubtags(languageCode: 'sr', scriptCode: 'Latn');
      return Locale(loc);
    }

    final hasCompletedOnboarding = prefs.getBool('onboarding_complete') ?? false;
    final initialLoc = hasCompletedOnboarding ? '/feed' : '/onboarding';

    // We inject initial location dynamically 
    // Usually better to inject via router, but for simplicity here we override go_router
    router.go(initialLoc);

    return MaterialApp.router(
      title: 'Balkan Giveaways',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: mode,
      locale: getAppLocale(localeValue),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('sr'), // Cyrillic default
        Locale.fromSubtags(languageCode: 'sr', scriptCode: 'Latn'), // Latin
        Locale('hr'),
        Locale('bs'),
      ],
      routerConfig: router,
    );
  }
}
