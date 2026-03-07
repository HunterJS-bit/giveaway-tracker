import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/providers.dart';
import 'widgets/giveaway_card.dart';

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favoritesAsync = ref.watch(favoritedGiveawaysProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Omiljeno'),
      ),
      body: favoritesAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Greška: $err')),
        data: (giveaways) {
          if (giveaways.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.favorite_border, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'Još niste dodali nijednu nagradnu igru u omiljene.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            );
          }
          return ListView.builder(
            itemCount: giveaways.length,
            padding: const EdgeInsets.only(bottom: 24),
            itemBuilder: (context, index) {
              return GiveawayCard(giveaway: giveaways[index]);
            },
          );
        },
      ),
    );
  }
}
