import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/feed/feed_screen.dart';
import '../../features/feed/favorites_screen.dart';
import '../../features/feed/submit_giveaway_screen.dart';
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
              pageBuilder: (ctx, state) {
                final id = state.pathParameters['id']!;
                return CustomTransitionPage(
                  key: state.pageKey,
                  child: GiveawayDetailScreen(giveawayId: id),
                  transitionDuration: const Duration(milliseconds: 400),
                  reverseTransitionDuration: const Duration(milliseconds: 300),
                  transitionsBuilder: (context, animation, secondaryAnimation, child) {
                    final curved = CurvedAnimation(
                      parent: animation,
                      curve: Curves.easeOutCubic,
                      reverseCurve: Curves.easeInCubic,
                    );
                    return FadeTransition(
                      opacity: curved,
                      child: SlideTransition(
                        position: Tween<Offset>(
                          begin: const Offset(0, 0.06),
                          end: Offset.zero,
                        ).animate(curved),
                        child: child,
                      ),
                    );
                  },
                );
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
        GoRoute(
          path: '/submit-giveaway',
          builder: (ctx, state) => const SubmitGiveawayScreen(),
        ),
      ],
    ),
  ],
);
