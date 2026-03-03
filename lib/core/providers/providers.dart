import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/giveaway.dart';
import '../services/api_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
// SharedPreferences provider
// ─────────────────────────────────────────────────────────────────────────────
final sharedPrefsProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('Initialize via ProviderScope.overrides');
});

// ─────────────────────────────────────────────────────────────────────────────
// Raw giveaway list – loaded from JSON asset
// ─────────────────────────────────────────────────────────────────────────────
class GiveawayFeedNotifier extends AsyncNotifier<List<Giveaway>> {
  int _offset = 0;
  static const int _limit = 20;
  bool _hasMore = true;

  bool get hasMore => _hasMore;

  @override
  Future<List<Giveaway>> build() async {
    return _fetchPage(0);
  }

  Future<List<Giveaway>> _fetchPage(int offset) async {
    final items = await ApiService.getPaginatedGiveaways(limit: _limit, offset: offset);
    if (items.length < _limit) {
      _hasMore = false;
    }
    return items;
  }

  Future<void> fetchNextPage() async {
    if (!_hasMore || state.isLoading || state.isRefreshing) return;

    final currentList = state.value ?? [];
    
    // Set to refreshing but preserve data to show in list while fetching
    state = const AsyncValue.loading();
    _offset += _limit;
    
    try {
      final nextItems = await _fetchPage(_offset);
      state = AsyncValue.data([...currentList, ...nextItems]);
    } catch (e, st) {
      // Revert offset on error
      _offset -= _limit;
      state = AsyncValue.data(currentList); // Or set error, but we preserve list for now
    }
  }

  Future<void> refresh() async {
    _offset = 0;
    _hasMore = true;
    state = const AsyncValue.loading();
    try {
       final items = await _fetchPage(0);
       state = AsyncValue.data(items);
    } catch (e, st) {
       state = AsyncValue.error(e, st);
    }
  }
}

final giveawayListProvider = AsyncNotifierProvider<GiveawayFeedNotifier, List<Giveaway>>(GiveawayFeedNotifier.new);

// ─────────────────────────────────────────────────────────────────────────────
// Filter state
// ─────────────────────────────────────────────────────────────────────────────
class FilterState {
  final Set<String> countries;
  final Set<String> categories;
  final bool hideEntered;

  const FilterState({
    this.countries = const {},
    this.categories = const {},
    this.hideEntered = false,
  });

  FilterState copyWith({
    Set<String>? countries,
    Set<String>? categories,
    bool? hideEntered,
  }) =>
      FilterState(
        countries: countries ?? this.countries,
        categories: categories ?? this.categories,
        hideEntered: hideEntered ?? this.hideEntered,
      );

  bool get hasActiveFilters => countries.isNotEmpty || categories.isNotEmpty;
}

class FilterNotifier extends Notifier<FilterState> {
  @override
  FilterState build() => const FilterState();

  void toggleCountry(String code) {
    final current = Set<String>.from(state.countries);
    if (current.contains(code)) {
      current.remove(code);
    } else {
      current.add(code);
    }
    state = state.copyWith(countries: current);
  }

  void toggleCategory(String cat) {
    final current = Set<String>.from(state.categories);
    if (current.contains(cat)) {
      current.remove(cat);
    } else {
      current.add(cat);
    }
    state = state.copyWith(categories: current);
  }

  void toggleHideEntered() {
    state = state.copyWith(hideEntered: !state.hideEntered);
  }

  void clearAll() {
    state = const FilterState();
  }
}

final filterProvider = NotifierProvider<FilterNotifier, FilterState>(FilterNotifier.new);

// ─────────────────────────────────────────────────────────────────────────────
// "I Entered This" tracking
// ─────────────────────────────────────────────────────────────────────────────
const _enteredKey = 'entered_giveaways';

class EnteredNotifier extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    final prefs = ref.read(sharedPrefsProvider);
    final stored = prefs.getStringList(_enteredKey) ?? [];
    return stored.toSet();
  }

  Future<void> toggleEntered(String id) async {
    final prefs = ref.read(sharedPrefsProvider);
    final next = Set<String>.from(state);
    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }
    state = next;
    await prefs.setStringList(_enteredKey, next.toList());
  }

  bool isEntered(String id) => state.contains(id);
}

final enteredProvider = NotifierProvider<EnteredNotifier, Set<String>>(EnteredNotifier.new);

// ─────────────────────────────────────────────────────────────────────────────
// Filtered feed (combines all the above)
// ─────────────────────────────────────────────────────────────────────────────
final filteredFeedProvider = Provider<AsyncValue<List<Giveaway>>>((ref) {
  final all = ref.watch(giveawayListProvider);
  final filters = ref.watch(filterProvider);
  final entered = ref.watch(enteredProvider);

  return all.whenData((giveaways) {
    return giveaways.where((g) {
      if (g.isExpired) return false;
      if (filters.countries.isNotEmpty && !filters.countries.contains(g.country)) return false;
      if (filters.categories.isNotEmpty && !filters.categories.contains(g.category)) return false;
      if (filters.hideEntered && entered.contains(g.id)) return false;
      return true;
    }).toList();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Ending Soon feed (< 6 hours)
// ─────────────────────────────────────────────────────────────────────────────
final endingSoonProvider = Provider<AsyncValue<List<Giveaway>>>((ref) {
  final all = ref.watch(giveawayListProvider);
  return all.whenData((giveaways) {
    final now = DateTime.now();
    return giveaways
        .where((g) => !g.isExpired && g.endDate.difference(now).inHours <= 6)
        .toList()
      ..sort((a, b) => a.endDate.compareTo(b.endDate));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Settings providers
// ─────────────────────────────────────────────────────────────────────────────
const _langKey = 'app_locale';
const _themeKey = 'app_theme_mode'; // 0=system,1=light,2=dark

class LocaleNotifier extends Notifier<String> {
  @override
  String build() {
    final prefs = ref.read(sharedPrefsProvider);
    return prefs.getString(_langKey) ?? 'sr';
  }

  Future<void> setLocale(String localeCode) async {
    final prefs = ref.read(sharedPrefsProvider);
    state = localeCode;
    await prefs.setString(_langKey, localeCode);
  }
}

final localeProvider = NotifierProvider<LocaleNotifier, String>(LocaleNotifier.new);

class ThemeModeNotifier extends Notifier<int> {
  @override
  int build() {
    final prefs = ref.read(sharedPrefsProvider);
    return prefs.getInt(_themeKey) ?? 0;
  }

  Future<void> setThemeMode(int mode) async {
    final prefs = ref.read(sharedPrefsProvider);
    state = mode;
    await prefs.setInt(_themeKey, mode);
  }
}

final themeModeProvider = NotifierProvider<ThemeModeNotifier, int>(ThemeModeNotifier.new);
