import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:balkan_giveaway_tracker/core/services/database_service.dart';
import 'package:balkan_giveaway_tracker/models/giveaway.dart';

void main() {
  // Setup sqflite_ffi for testing
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  group('DatabaseService Tests', () {
    late Giveaway testGiveaway;

    setUp(() {
      testGiveaway = Giveaway(
        id: 'test-1',
        title: 'Test Giveaway',
        brand: 'Test Brand',
        brandLogoUrl: 'https://example.com/logo.png',
        imageUrl: 'https://example.com/image.png',
        description: 'Test Description',
        prize: 'Test Prize',
        prizeValue: 100.0,
        currency: 'EUR',
        country: 'RS',
        category: 'Tech',
        entryUrl: 'https://example.com/entry',
        startDate: DateTime.now(),
        endDate: DateTime.now().add(const Duration(days: 7)),
        isFeatured: true,
        isVerified: true,
        entryCount: 10,
      );
    });

    test('Add and Get Favorite', () async {
      final dbService = DatabaseService.instance;
      
      await dbService.addFavorite(testGiveaway);
      final favorites = await dbService.getFavorites();
      
      expect(favorites.length, 1);
      expect(favorites.first.id, testGiveaway.id);
      expect(favorites.first.title, testGiveaway.title);
      expect(favorites.first.isFeatured, true);
    });

    test('Remove Favorite', () async {
      final dbService = DatabaseService.instance;
      
      await dbService.addFavorite(testGiveaway);
      await dbService.removeFavorite(testGiveaway.id);
      final favorites = await dbService.getFavorites();
      
      expect(favorites, isEmpty);
    });
  });
}
