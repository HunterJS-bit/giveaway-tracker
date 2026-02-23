import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/providers/providers.dart';
import '../../../models/giveaway.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final Set<String> _selectedCountries = {};
  String _selectedLocale = 'sr';

  void _completeOnboarding() async {
    final prefs = ref.read(sharedPrefsProvider);
    await prefs.setBool('onboarding_complete', true);
    
    // Save selected countries to initial filter
    if (_selectedCountries.isNotEmpty) {
      for (final c in _selectedCountries) {
        ref.read(filterProvider.notifier).toggleCountry(c);
      }
    }
    
    if (mounted) context.go('/feed');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 48),
              const Icon(Icons.celebration, size: 64, color: Colors.orange),
              const SizedBox(height: 24),
              Text(
                'Dobrodošli u\nBalkan Giveaways!',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Pronađi najbolje nagradne igre na Balkanu.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),

              // Language
              const Text('Izaberi jezik interfejsa:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedLocale,
                decoration: InputDecoration(
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                ),
                items: const [
                  DropdownMenuItem(value: 'sr', child: Text('Srpski (Ćirilica)')),
                  DropdownMenuItem(value: 'sr_Latn', child: Text('Srpski (Latinica)')),
                  DropdownMenuItem(value: 'hr', child: Text('Hrvatski')),
                  DropdownMenuItem(value: 'bs', child: Text('Bosanski')),
                ],
                onChanged: (val) {
                  if (val != null) {
                    setState(() => _selectedLocale = val);
                    ref.read(localeProvider.notifier).setLocale(val);
                  }
                },
              ),
              const SizedBox(height: 24),

              // Countries
              const Row(
                children: [
                   Text('Prikaži mi nagradne igre iz:', style: TextStyle(fontWeight: FontWeight.bold)),
                   SizedBox(width: 8),
                   Text('(Neobavezno)', style: TextStyle(fontSize: 12, color: Colors.grey)),
                ]
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: GiveawayCountries.all.map((c) {
                  final isSelected = _selectedCountries.contains(c['code']);
                  return FilterChip(
                    label: Text('${c['flag']} ${c['code']}'),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        if (selected) _selectedCountries.add(c['code']!);
                        else _selectedCountries.remove(c['code']!);
                      });
                    },
                  );
                }).toList(),
              ),

              const Spacer(),
              ElevatedButton(
                onPressed: _completeOnboarding,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Započni!'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
