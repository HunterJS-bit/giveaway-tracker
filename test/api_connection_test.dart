import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

void main() async {
  const String baseUrl = 'http://localhost:3000/api';
  print('--- API Connection Test ---');
  print('Target: $baseUrl');

  try {
    print('\n1. Testing GET /giveaways...');
    final getResponse = await http.get(Uri.parse('$baseUrl/giveaways?limit=1')).timeout(Duration(seconds: 5));
    print('Status: ${getResponse.statusCode}');
    if (getResponse.statusCode == 200) {
      print('Success! Data: ${getResponse.body.substring(0, getResponse.body.length > 100 ? 100 : getResponse.body.length)}...');
    } else {
      print('Failed with status ${getResponse.statusCode}');
    }

    print('\n2. Testing POST /submissions...');
    final postResponse = await http.post(
      Uri.parse('$baseUrl/submissions'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'url': 'https://test-giveaway.com'}),
    ).timeout(Duration(seconds: 5));
    print('Status: ${postResponse.statusCode}');
    if (postResponse.statusCode == 201) {
      print('Success! Submission created.');
    } else {
      print('Failed with status ${postResponse.statusCode}: ${postResponse.body}');
    }

  } catch (e) {
    print('\n[ERROR] Could not connect to backend: $e');
    print('Make sure the backend is running (cd backend && npm run dev)');
  }
}
