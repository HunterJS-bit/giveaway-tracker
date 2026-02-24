import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/providers.dart';
import '../feed/widgets/giveaway_card.dart';

class EndingSoonScreen extends ConsumerWidget {
  const EndingSoonScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final endingSoonAsync = ref.watch(endingSoonProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ističe uskoro (< 6h)'),
      ),
      body: endingSoonAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Greška: $err')),
        data: (giveaways) {
          if (giveaways.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24.0),
                child: Text(
                  'Trenutno nema nagradnih igara koje ističu u narednih 6 sati.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16),
                ),
              ),
            );
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(giveawayListProvider);
            },
            child: ListView.builder(
              itemCount: giveaways.length,
              padding: const EdgeInsets.only(bottom: 24),
              itemBuilder: (context, index) {
                return GiveawayCard(giveaway: giveaways[index]);
              },
            ),
          );
        },
      ),
    );
  }
}
