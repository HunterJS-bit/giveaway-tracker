import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../../../models/giveaway.dart';

class ApiService {
  // Use 10.0.2.2 for Android Emulator, localhost for iOS/Web/Desktop
  static String get baseUrl {
    // Allows overriding via --dart-define=API_BASE_URL=...
    const envUrl = String.fromEnvironment('API_BASE_URL');
    if (envUrl.isNotEmpty) return envUrl;

    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
  }

  // 1. Fetching Giveaways
  static Future<List<Giveaway>> getPaginatedGiveaways(int limit, int offset) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/giveaways?limit=$limit&offset=$offset'),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.map((g) => Giveaway.fromJson(g)).toList();
      } else {
        throw ApiException(
          message: 'Greška pri učitavanju nagradnih igara',
          statusCode: response.statusCode,
        );
      }
    } on SocketException {
      throw const ApiException(message: 'Nema internet konekcije ili server nije dostupan');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException(message: 'Neočekivana greška: $e');
    }
  }

  // 2. Submitting a new giveaway (User Submission)
  static Future<void> submitGiveaway(String url) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/submissions'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'url': url}),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode != 201) {
        final errorData = jsonDecode(response.body);
        throw ApiException(
          message: errorData['error'] ?? 'Neuspešno slanje',
          statusCode: response.statusCode,
        );
      }
    } on SocketException {
      throw const ApiException(message: 'Server nije dostupan. Proverite konekciju.');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException(message: 'Greška pri slanju: $e');
    }
  }

  static Future<List<Giveaway>> getGiveaways() async {
    return getPaginatedGiveaways(100, 0);
  }

  // 3. Mark Entered (Placeholder for future)
  static Future<void> markEntered(String giveawayId, String userId) async {
    // Implement when auth is ready
  }

  // 4. Subscribe to push notifications (Placeholder)
  static Future<void> subscribeToEndingSoon(String category) async {
    throw UnimplementedError('Requires Firebase Cloud Messaging integration');
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException({required this.message, this.statusCode});

  @override
  String toString() => message;
}
