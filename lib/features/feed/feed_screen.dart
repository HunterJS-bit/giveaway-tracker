import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/providers.dart';
import 'widgets/giveaway_card.dart';
import 'widgets/filter_bar.dart';

class FeedScreen extends ConsumerWidget {
  const FeedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final feedAsync = ref.watch(filteredFeedProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Balkan Giveaways'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          )
        ],
      ),
      body: Column(
        children: [
          const FilterBar(),
          Expanded(
            child: feedAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Greška: $err')),
              data: (giveaways) {
                if (giveaways.isEmpty) {
                  return const Center(
                    child: Text('Nema nagradnih igara za ove filtere.'),
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
          ),
        ],
      ),
    );
  }
}
