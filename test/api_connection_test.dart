import 'package:balkan_giveaway_tracker/core/services/api_service.dart';

void main() async {
  print('--- API Service Integration Test ---');
  print('Base URL: ${ApiService.baseUrl}');

  try {
    print('\n1. Testing ApiService.getPaginatedGiveaways(1, 0)...');
    final giveaways = await ApiService.getPaginatedGiveaways(1, 0);
    print('Success! Found ${giveaways.length} giveaways.');
    if (giveaways.isNotEmpty) {
      print('First item: ${giveaways.first.title}');
    }

    print('\n2. Testing ApiService.submitGiveaway...');
    await ApiService.submitGiveaway('https://test-from-api-service.com');
    print('Success! Submission created.');

  } catch (e) {
    print('\n[ERROR] ApiService test failed: $e');
    print('Make sure the backend is running (cd backend && npm run dev)');
  }
}
