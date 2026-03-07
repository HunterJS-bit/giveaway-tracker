import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/feed/feed_screen.dart';
import '../../features/feed/favorites_screen.dart';
import '../../features/detail/giveaway_detail_screen.dart';
import '../../features/ending_soon/ending_soon_screen.dart';
import '../../features/settings/settings_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../shell/app_shell.dart';

final router = GoRouter(
  initialLocation: '/feed',
  routes: [
    GoRoute(
      path: '/onboarding',
      builder: (ctx, state) => const OnboardingScreen(),
    ),
    ShellRoute(
      builder: (ctx, state, child) => AppShell(child: child),
      routes: [
        GoRoute(
          path: '/feed',
          builder: (ctx, state) => const FeedScreen(),
          routes: [
            GoRoute(
              path: 'detail/:id',
              builder: (ctx, state) {
                final id = state.pathParameters['id']!;
                return GiveawayDetailScreen(giveawayId: id);
              },
            ),
          ],
        ),
        GoRoute(
          path: '/ending-soon',
          builder: (ctx, state) => const EndingSoonScreen(),
        ),
        GoRoute(
          path: '/favorites',
          builder: (ctx, state) => const FavoritesScreen(),
        ),
        GoRoute(
          path: '/settings',
          builder: (ctx, state) => const SettingsScreen(),
        ),
      ],
    ),
  ],
);
