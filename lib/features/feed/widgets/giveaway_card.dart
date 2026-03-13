import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import '../../../models/giveaway.dart';
import '../../../core/providers/providers.dart';

class GiveawayCard extends ConsumerWidget {
  final Giveaway giveaway;

  const GiveawayCard({super.key, required this.giveaway});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isEntered = ref.watch(enteredProvider).contains(giveaway.id);
    final isFavorite = ref.watch(favoritesProvider).valueOrNull?.any((g) => g.id == giveaway.id) ?? false;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: giveaway.isFeatured
            ? const BorderSide(color: AppColors.featured, width: 2)
            : BorderSide.none,
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => context.go('/feed/detail/${giveaway.id}'),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image header
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: CachedNetworkImage(
                    imageUrl: giveaway.imageUrl,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    placeholder: (ctx, url) => Container(color: theme.colorScheme.surfaceVariant),
                    errorWidget: (ctx, url, err) => const Icon(Icons.error),
                  ),
                ),
                if (giveaway.isFeatured)
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.featured,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.star, size: 14, color: Colors.black),
                          SizedBox(width: 4),
                          Text(
                            'Sponzorisano',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black),
                          ),
                        ],
                      ),
                    ),
                  ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${giveaway.countryFlag} ${GiveawayCategories.emoji(giveaway.category)}',
                      style: const TextStyle(fontSize: 14),
                    ),
                  ),
                ),
                Positioned(
                  top: 56,
                  right: 12,
                  child: IconButton(
                    onPressed: () => ref.read(favoritesProvider.notifier).toggleFavorite(giveaway),
                    icon: Icon(
                      isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: isFavorite ? Colors.red : Colors.white,
                    ),
                    style: IconButton.styleFrom(
                      backgroundColor: Colors.black.withOpacity(0.4),
                    ),
                    tooltip: isFavorite ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene',
                  ),
                ),
                // "Ending Soon" badge
                if (giveaway.isEndingSoon)
                  Positioned(
                    bottom: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.endingSoon,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.timer, size: 14, color: Colors.white),
                          const SizedBox(width: 4),
                          Text(
                            'Ističe za ${giveaway.timeRemaining.inHours}h',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  )
              ],
            ),
            
            // Content body
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundImage: CachedNetworkImageProvider(giveaway.brandLogoUrl),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        giveaway.brand,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: AppColors.textMuted,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      if (giveaway.isVerified)
                        const Padding(
                          padding: EdgeInsets.only(left: 4.0),
                          child: Icon(Icons.verified, size: 14, color: AppColors.verified),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    giveaway.title,
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Nagrada: ${giveaway.prize} (${giveaway.formattedPrizeValue()})',
                    style: TextStyle(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${giveaway.entryCount} prijava',
                        style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textMuted),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.share_outlined),
                            onPressed: () {
                              Share.share(
                                'Check out this ${giveaway.prize} giveaway by ${giveaway.brand}! Enter here: ${giveaway.entryUrl}'
                              );
                            },
                            tooltip: 'Podeli',
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton.icon(
                            onPressed: () => ref.read(enteredProvider.notifier).toggleEntered(giveaway.id),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isEntered ? Colors.grey.shade300 : theme.colorScheme.primary,
                              foregroundColor: isEntered ? Colors.black54 : Colors.white,
                              elevation: 0,
                            ),
                            icon: Icon(isEntered ? Icons.check_circle : Icons.add_circle_outline, size: 18),
                            label: Text(isEntered ? 'Uneto' : 'Prijavi se'),
                          ),
                        ]
                      )
                    ],
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
