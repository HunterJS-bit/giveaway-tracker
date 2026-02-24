import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/providers.dart';
import '../../../models/giveaway.dart';

class FilterBar extends ConsumerWidget {
  const FilterBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filterState = ref.watch(filterProvider);
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Hide entered toggle
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filteri',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              Row(
                children: [
                  const Text('Sakrij unete', style: TextStyle(fontSize: 13)),
                  Switch.adaptive(
                    value: filterState.hideEntered,
                    onChanged: (_) => ref.read(filterProvider.notifier).toggleHideEntered(),
                  ),
                ],
              )
            ],
          ),
        ),

        // Countries
        SizedBox(
          height: 48,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: GiveawayCountries.all.length,
            itemBuilder: (ctx, i) {
              final c = GiveawayCountries.all[i];
              final isSelected = filterState.countries.contains(c['code']);
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: FilterChip(
                  label: Text('${c['flag']} ${c['code']}'),
                  selected: isSelected,
                  onSelected: (_) => ref.read(filterProvider.notifier).toggleCountry(c['code']!),
                ),
              );
            },
          ),
        ),

        const SizedBox(height: 8),

        // Categories
        SizedBox(
          height: 48,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: GiveawayCategories.all.length,
            itemBuilder: (ctx, i) {
              final cat = GiveawayCategories.all[i];
              final isSelected = filterState.categories.contains(cat);
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: FilterChip(
                  label: Text('${GiveawayCategories.emoji(cat)} $cat'),
                  selected: isSelected,
                  onSelected: (_) => ref.read(filterProvider.notifier).toggleCategory(cat),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
