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
  final String status; // active, expired, verified
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
    required this.status,
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
      status: (json['status'] as String?) ?? 'active',
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
        'status': status,
        'entryCount': entryCount,
      };

  // Database helpers (for sqflite)
  Map<String, dynamic> toDbMap() {
    final map = toJson();
    // SQLite doesn't have a boolean type, so we convert to int
    map['isFeatured'] = isFeatured ? 1 : 0;
    map['isVerified'] = isVerified ? 1 : 0;
    return map;
  }

  factory Giveaway.fromDbMap(Map<String, dynamic> map) {
    return Giveaway(
      id: map['id'] as String,
      title: map['title'] as String,
      brand: map['brand'] as String,
      brandLogoUrl: map['brandLogoUrl'] as String,
      imageUrl: map['imageUrl'] as String,
      description: map['description'] as String,
      prize: map['prize'] as String,
      prizeValue: (map['prizeValue'] as num).toDouble(),
      currency: map['currency'] as String,
      country: map['country'] as String,
      category: map['category'] as String,
      entryUrl: map['entryUrl'] as String,
      startDate: DateTime.parse(map['startDate'] as String),
      endDate: DateTime.parse(map['endDate'] as String),
      isFeatured: (map['isFeatured'] as int) == 1,
      isVerified: (map['isVerified'] as int) == 1,
      status: (map['status'] as String?) ?? 'active',
      entryCount: map['entryCount'] as int,
    );
  }

  Giveaway copyWith({
    String? id,
    String? title,
    String? brand,
    String? brandLogoUrl,
    String? imageUrl,
    String? description,
    String? prize,
    double? prizeValue,
    String? currency,
    String? country,
    String? category,
    String? entryUrl,
    DateTime? startDate,
    DateTime? endDate,
    bool? isFeatured,
    bool? isVerified,
    String? status,
    int? entryCount,
  }) {
    return Giveaway(
      id: id ?? this.id,
      title: title ?? this.title,
      brand: brand ?? this.brand,
      brandLogoUrl: brandLogoUrl ?? this.brandLogoUrl,
      imageUrl: imageUrl ?? this.imageUrl,
      description: description ?? this.description,
      prize: prize ?? this.prize,
      prizeValue: prizeValue ?? this.prizeValue,
      currency: currency ?? this.currency,
      country: country ?? this.country,
      category: category ?? this.category,
      entryUrl: entryUrl ?? this.entryUrl,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      isFeatured: isFeatured ?? this.isFeatured,
      isVerified: isVerified ?? this.isVerified,
      status: status ?? this.status,
      entryCount: entryCount ?? this.entryCount,
    );
  }

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
