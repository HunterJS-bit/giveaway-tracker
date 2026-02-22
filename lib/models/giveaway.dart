import 'dart:convert';

class Giveaway {
  final String id;
  final String title;
  final String brand;
  final String brandLogoUrl;
  final String imageUrl;
  final String description;
  final String prize;
  final double prizeValue;
  final String currency;
  final String country; // ISO 3166-1 alpha-2: RS, HR, BA
  final String category;
  final String entryUrl;
  final DateTime startDate;
  final DateTime endDate;
  final bool isFeatured;
  final bool isVerified;
  final int entryCount;

  const Giveaway({
    required this.id,
    required this.title,
    required this.brand,
    required this.brandLogoUrl,
    required this.imageUrl,
    required this.description,
    required this.prize,
    required this.prizeValue,
    required this.currency,
    required this.country,
    required this.category,
    required this.entryUrl,
    required this.startDate,
    required this.endDate,
    required this.isFeatured,
    required this.isVerified,
    required this.entryCount,
  });

  factory Giveaway.fromJson(Map<String, dynamic> json) {
    return Giveaway(
      id: json['id'] as String,
      title: json['title'] as String,
      brand: json['brand'] as String,
      brandLogoUrl: json['brandLogoUrl'] as String,
      imageUrl: json['imageUrl'] as String,
      description: json['description'] as String,
      prize: json['prize'] as String,
      prizeValue: (json['prizeValue'] as num).toDouble(),
      currency: json['currency'] as String,
      country: json['country'] as String,
      category: json['category'] as String,
      entryUrl: json['entryUrl'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      isFeatured: json['isFeatured'] as bool,
      isVerified: json['isVerified'] as bool,
      entryCount: json['entryCount'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'brand': brand,
        'brandLogoUrl': brandLogoUrl,
        'imageUrl': imageUrl,
        'description': description,
        'prize': prize,
        'prizeValue': prizeValue,
        'currency': currency,
        'country': country,
        'category': category,
        'entryUrl': entryUrl,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        'isFeatured': isFeatured,
        'isVerified': isVerified,
        'entryCount': entryCount,
      };

  // Helpers
  bool get isEndingSoon {
    final diff = endDate.difference(DateTime.now());
    return diff.inHours <= 6 && diff.isNegative == false;
  }

  bool get isExpired => DateTime.now().isAfter(endDate);

  Duration get timeRemaining => endDate.difference(DateTime.now());

  String get countryFlag {
    switch (country) {
      case 'RS':
        return '🇷🇸';
      case 'HR':
        return '🇭🇷';
      case 'BA':
        return '🇧🇦';
      default:
        return '🏳️';
    }
  }

  String get countryName {
    switch (country) {
      case 'RS':
        return 'Srbija';
      case 'HR':
        return 'Hrvatska';
      case 'BA':
        return 'Bosna i Hercegovina';
      default:
        return country;
    }
  }

  String formattedPrizeValue() {
    if (prizeValue >= 1000) {
      return '${(prizeValue / 1000).toStringAsFixed(1)}k $currency';
    }
    return '${prizeValue.toStringAsFixed(0)} $currency';
  }

  static List<Giveaway> listFromJson(String source) {
    final data = jsonDecode(source) as Map<String, dynamic>;
    final list = data['giveaways'] as List<dynamic>;
    return list.map((e) => Giveaway.fromJson(e as Map<String, dynamic>)).toList();
  }
}

// Available categories
class GiveawayCategories {
  static const List<String> all = [
    'Tech',
    'Beauty',
    'Cars',
    'Travel',
    'Food',
    'Gaming',
    'Fashion',
    'Home',
  ];

  static String emoji(String category) {
    switch (category) {
      case 'Tech':
        return '💻';
      case 'Beauty':
        return '💄';
      case 'Cars':
        return '🚗';
      case 'Travel':
        return '✈️';
      case 'Food':
        return '🍽️';
      case 'Gaming':
        return '🎮';
      case 'Fashion':
        return '👗';
      case 'Home':
        return '🏠';
      default:
        return '🎁';
    }
  }
}

// Available countries
class GiveawayCountries {
  static const List<Map<String, String>> all = [
    {'code': 'RS', 'name': 'Srbija', 'flag': '🇷🇸'},
    {'code': 'HR', 'name': 'Hrvatska', 'flag': '🇭🇷'},
    {'code': 'BA', 'name': 'Bosna i Hercegovina', 'flag': '🇧🇦'},
  ];
}
