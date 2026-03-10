import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../models/giveaway.dart';

/// This is a stub for the future real backend API.
/// Currently the app uses mock JSON data from `assets/data/giveaways.json`.
/// When you are ready for a real backend (e.g. Node.js, Supabase, Firebase),
/// you can implement these methods.
class ApiService {
  static const String baseUrl = 'http://localhost:3000/api'; // Use localhost for local dev

  // 1. Fetching Giveaways
  static Future<List<Giveaway>> getPaginatedGiveaways({required int limit, required int offset}) async {
    final response = await http.get(Uri.parse('$baseUrl/giveaways?limit=$limit&offset=$offset'));
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((g) => Giveaway.fromJson(g)).toList();
    } else {
      throw Exception('Failed to load giveaways');
    }
  }

  // 2. Submitting a new giveaway (User Submission)
  static Future<void> submitGiveaway(String url) async {
    final response = await http.post(
      Uri.parse('$baseUrl/submissions'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'url': url}),
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Neuspešno slanje');
    }
  }

  static Future<List<Giveaway>> getGiveaways() async {
    // This was the old stub, redirecting to paginated for now or keeping as is
    return getPaginatedGiveaways(limit: 100, offset: 0);
  }

  // 2. Marking as Entered (if you want to track it on the server, not just locally)
  static Future<void> markEntered(String giveawayId, String userId) async {
    /*
    await http.post(
      Uri.parse('$baseUrl/giveaways/$giveawayId/enter'),
      headers: {'Authorization': 'Bearer $userId'},
    );
    */
  }

  // 3. Subscribing to "Ending Soon" push notification topic using FCM
  static Future<void> subscribeToEndingSoon(String category) async {
    throw UnimplementedError('Requires Firebase Cloud Messaging integration');
  }
}
