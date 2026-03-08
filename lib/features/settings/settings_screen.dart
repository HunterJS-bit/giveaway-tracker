import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/providers.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final locale = ref.watch(localeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Postavke'),
      ),
      body: ListView(
        children: [
          _buildSectionHeader(context, 'Izgled'),
          ListTile(
            leading: const Icon(Icons.dark_mode),
            title: const Text('Tema'),
            trailing: DropdownButton<int>(
              value: themeMode,
              underline: const SizedBox(),
              items: const [
                DropdownMenuItem(value: 0, child: Text('Sistemska')),
                DropdownMenuItem(value: 1, child: Text('Svetla')),
                DropdownMenuItem(value: 2, child: Text('Tamna')),
              ],
              onChanged: (val) {
                if (val != null) ref.read(themeModeProvider.notifier).setThemeMode(val);
              },
            ),
          ),
          
          _buildSectionHeader(context, 'Jezik / Lokalizacija'),
          ListTile(
            leading: const Icon(Icons.language),
            title: const Text('Jezik aplikacije'),
            trailing: DropdownButton<String>(
              value: locale,
              underline: const SizedBox(),
              items: const [
                DropdownMenuItem(value: 'sr', child: Text('Srpski (Ćirilica)')),
                DropdownMenuItem(value: 'sr_Latn', child: Text('Srpski (Latinica)')),
                DropdownMenuItem(value: 'hr', child: Text('Hrvatski')),
                DropdownMenuItem(value: 'bs', child: Text('Bosanski')),
              ],
              onChanged: (val) {
                if (val != null) ref.read(localeProvider.notifier).setLocale(val);
              },
            ),
          ),

          _buildSectionHeader(context, 'Notifikacije'),
          SwitchListTile(
            secondary: const Icon(Icons.notifications_active),
            title: const Text('Ističe uskoro upozorenja'),
            subtitle: const Text('Obavesti me kada giveaway ističe za manje od 6h'),
            value: true, // Placeholder for local notification toggle
            onChanged: (val) {},
          ),

          _buildSectionHeader(context, 'Doprinesi'),
          ListTile(
            leading: const Icon(Icons.add_circle_outline),
            title: const Text('Predloži nagradnu igru'),
            subtitle: const Text('Pronašli ste nešto novo? Javite nam!'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/submit-giveaway'),
          ),

          _buildSectionHeader(context, 'Više informacija'),
          ListTile(
            leading: const Icon(Icons.info_outline),
            title: const Text('O aplikaciji'),
            subtitle: const Text('Verzija 1.0.0'),
            onTap: () {
              showAboutDialog(
                context: context,
                applicationName: 'Balkan Giveaway Tracker',
                applicationVersion: '1.0.0',
                applicationLegalese: '© 2026 Balkan Giveaways',
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, right: 16, top: 24, bottom: 8),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          fontSize: 12,
          fontWeight: 
          FontWeight.bold,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}
