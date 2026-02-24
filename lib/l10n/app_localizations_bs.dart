// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Bosnian (`bs`).
class AppLocalizationsBs extends AppLocalizations {
  AppLocalizationsBs([String locale = 'bs']) : super(locale);

  @override
  String get appTitle => 'Balkan Giveaways';

  @override
  String get feedTab => 'Pregled';

  @override
  String get endingSoonTab => 'Ističe Uskoro';

  @override
  String get settingsTab => 'Postavke';

  @override
  String get filters => 'Filteri';

  @override
  String get hideEntered => 'Sakrij prijavljene';

  @override
  String get sponsored => 'Sponzorisano';

  @override
  String expiresIn(Object hours) {
    return 'Ističe za ${hours}h';
  }

  @override
  String get prizePrefix => 'Nagrada:';

  @override
  String entriesCount(Object count) {
    return '$count prijava';
  }

  @override
  String get enteredBtn => 'Prijavljeno';

  @override
  String get enterBtn => 'Prijavi se';

  @override
  String get noGiveaways => 'Nema nagradnih igara za ove filtere.';

  @override
  String get endingSoonTitle => 'Ističe uskoro (< 6h)';

  @override
  String get noEndingSoon =>
      'Trenutno nema nagradnih igara koje ističu u narednih 6 sati.';

  @override
  String get settingsAppearance => 'Izgled';

  @override
  String get settingsTheme => 'Tema';

  @override
  String get settingsLanguage => 'Jezik aplikacije';

  @override
  String get settingsNotifications => 'Notifikacije';

  @override
  String get settingsAlerts => 'Upozorenja o isteku';

  @override
  String get settingsAlertsDesc =>
      'Obavijesti me kada nagradna igra ističe za manje od 6h';

  @override
  String get settingsAbout => 'O aplikaciji';

  @override
  String get welcomeTitle => 'Dobrodošli u\\nBalkan Giveaways!';

  @override
  String get welcomeDesc => 'Pronađi najbolje nagradne igre na Balkanu.';

  @override
  String get onboardingLang => 'Odaberi jezik interfejsa:';

  @override
  String get onboardingCountry => 'Prikaži mi nagradne igre iz:';

  @override
  String get onboardingOptional => '(Opcionalno)';

  @override
  String get onboardingStart => 'Započni!';

  @override
  String get detailAbout => 'O nagradnoj igri';

  @override
  String get detailMarkEntered => 'Označio sam kao prijavljeno';

  @override
  String get detailMarkDesc =>
      'Ova nagradna igra će biti sakrivena ako uključiš filter \\\"Sakrij prijavljene\\\"';

  @override
  String get detailGoToEntry => 'Idi na prijavu';
}
