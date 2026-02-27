import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../models/giveaway.dart';

/// This is a stub for the future real backend API.
/// Currently the app uses mock JSON data from `assets/data/giveaways.json`.
/// When you are ready for a real backend (e.g. Node.js, Supabase, Firebase),
/// you can implement these methods.
class ApiService {
  static const String baseUrl = 'https://api.yourdomain.com/v1';

  // 1. Fetching Giveaways
  static Future<List<Giveaway>> getGiveaways() async {
    // Example implementation for production:
    /*
    final response = await http.get(Uri.parse('\$baseUrl/giveaways'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return (data['items'] as List).map((g) => Giveaway.fromJson(g)).toList();
    } else {
      throw Exception('Failed to load giveaways');
    }
    */
    throw UnimplementedError('Real backend not yet connected');
  }

  // 2. Marking as Entered (if you want to track it on the server, not just locally)
  static Future<void> markEntered(String giveawayId, String userId) async {
    /*
    await http.post(
      Uri.parse('\$baseUrl/giveaways/\$giveawayId/enter'),
      headers: {'Authorization': 'Bearer \$userId'},
    );
    */
  }

  // 3. Subscribing to "Ending Soon" push notification topic using FCM
  static Future<void> subscribeToEndingSoon(String category) async {
    throw UnimplementedError('Requires Firebase Cloud Messaging integration');
  }
}
