import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import '../../core/providers/providers.dart';
import '../../core/theme/app_theme.dart';
import '../../../models/giveaway.dart';

class GiveawayDetailScreen extends ConsumerWidget {
  final String giveawayId;

  const GiveawayDetailScreen({super.key, required this.giveawayId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final feedAsync = ref.watch(giveawayListProvider);
    final theme = Theme.of(context);
    final isEntered = ref.watch(enteredProvider).contains(giveawayId);

    return feedAsync.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (err, stack) => Scaffold(body: Center(child: Text('Greška: $err'))),
      data: (giveaways) {
        final giveaway = giveaways.firstWhere(
          (g) => g.id == giveawayId,
          orElse: () => throw Exception('Giveaway not found'),
        );

        return Scaffold(
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 250,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      CachedNetworkImage(
                        imageUrl: giveaway.imageUrl,
                        fit: BoxFit.cover,
                      ),
                      Container(color: Colors.black38), // Dark overlay for text readability
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header: Brand & Verified
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundImage: CachedNetworkImageProvider(giveaway.brandLogoUrl),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            giveaway.brand,
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppColors.textMuted,
                            ),
                          ),
                          if (giveaway.isVerified)
                            const Padding(
                              padding: EdgeInsets.only(left: 4.0),
                              child: Icon(Icons.verified, size: 16, color: AppColors.verified),
                            ),
                          const Spacer(),
                          Chip(
                            label: Text('${GiveawayCategories.emoji(giveaway.category)} ${giveaway.category}'),
                            labelStyle: const TextStyle(fontSize: 12),
                            padding: EdgeInsets.zero,
                          )
                        ],
                      ),
                      const SizedBox(height: 16),
                      
                      // Title & Prize
                      Text(
                        giveaway.title,
                        style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '🏆 Nagrada: ${giveaway.prize}',
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Meta info row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _MetaBadge(
                            icon: Icons.flag,
                            text: '${giveaway.countryFlag} ${giveaway.countryName}',
                          ),
                          _MetaBadge(
                            icon: Icons.calendar_today,
                            text: 'Do ${DateFormat('dd.MM.yyyy').format(giveaway.endDate)}',
                            color: giveaway.isEndingSoon ? AppColors.endingSoon : null,
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      
                      // Description
                      Text(
                        'O nagradnoj igri',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        giveaway.description,
                        style: theme.textTheme.bodyLarge?.copyWith(height: 1.5),
                      ),
                      const SizedBox(height: 32),
                      
                      // "Entered" status toggle
                      SwitchListTile(
                        title: const Text('Označio sam kao prijavljeno', style: TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: const Text('Ovaj giveaway će biti sakriven ako uključiš filter "Sakrij unete"'),
                        value: isEntered,
                        activeColor: theme.colorScheme.primary,
                        onChanged: (val) => ref.read(enteredProvider.notifier).toggleEntered(giveaway.id),
                        contentPadding: EdgeInsets.zero,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          bottomNavigationBar: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                onPressed: () => _launchURL(giveaway.entryUrl),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: Colors.white,
                  textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Idi na prijavu'),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _launchURL(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      debugPrint('Could not launch \$url');
    }
  }
}

class _MetaBadge extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color? color;

  const _MetaBadge({required this.icon, required this.text, this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.5),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color ?? Theme.of(context).iconTheme.color),
          const SizedBox(width: 8),
          Text(text, style: TextStyle(fontWeight: FontWeight.w600, color: color)),
        ],
      ),
    );
  }
}
