// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Serbian (`sr`).
class AppLocalizationsSr extends AppLocalizations {
  AppLocalizationsSr([String locale = 'sr']) : super(locale);

  @override
  String get appTitle => 'Balkan Giveaways';

  @override
  String get feedTab => 'Ленд';

  @override
  String get endingSoonTab => 'Истиче Ускоро';

  @override
  String get settingsTab => 'Поставке';

  @override
  String get filters => 'Филтери';

  @override
  String get hideEntered => 'Сакриј унете';

  @override
  String get sponsored => 'Спонзорисано';

  @override
  String expiresIn(Object hours) {
    return 'Истиче за ${hours}h';
  }

  @override
  String get prizePrefix => 'Награда:';

  @override
  String entriesCount(Object count) {
    return '$count пријава';
  }

  @override
  String get enteredBtn => 'Унето';

  @override
  String get enterBtn => 'Пријави се';

  @override
  String get noGiveaways => 'Нема наградних игара за ове филтере.';

  @override
  String get endingSoonTitle => 'Истиче ускоро (< 6h)';

  @override
  String get noEndingSoon =>
      'Тренутно нема наградних игара које истичу у наредних 6 сати.';

  @override
  String get settingsAppearance => 'Изглед';

  @override
  String get settingsTheme => 'Тема';

  @override
  String get settingsLanguage => 'Језик апликације';

  @override
  String get settingsNotifications => 'Нотификације';

  @override
  String get settingsAlerts => 'Истиче ускоро упозорења';

  @override
  String get settingsAlertsDesc =>
      'Обавести ме када giveaway истиче за мање од 6h';

  @override
  String get settingsAbout => 'О апликацији';

  @override
  String get welcomeTitle => 'Добродошли у\\nBalkan Giveaways!';

  @override
  String get welcomeDesc => 'Пронађи најбоље наградне игре на Балкану.';

  @override
  String get onboardingLang => 'Изабери језик интерфејса:';

  @override
  String get onboardingCountry => 'Прикажи ми наградне игре из:';

  @override
  String get onboardingOptional => '(Необавезно)';

  @override
  String get onboardingStart => 'Започни!';

  @override
  String get detailAbout => 'О наградној игри';

  @override
  String get detailMarkEntered => 'Означио сам као пријављено';

  @override
  String get detailMarkDesc =>
      'Овај giveaway ће бити сакривен ако укључиш филтер \\\"Сакриј унете\\\"';

  @override
  String get detailGoToEntry => 'Иди на пријаву';
}

/// The translations for Serbian, using the Latin script (`sr_Latn`).
class AppLocalizationsSrLatn extends AppLocalizationsSr {
  AppLocalizationsSrLatn() : super('sr_Latn');

  @override
  String get appTitle => 'Balkan Giveaways';

  @override
  String get feedTab => 'Lend';

  @override
  String get endingSoonTab => 'Ističe Uskoro';

  @override
  String get settingsTab => 'Postavke';

  @override
  String get filters => 'Filteri';

  @override
  String get hideEntered => 'Sakrij unete';

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
  String get enteredBtn => 'Uneto';

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
  String get settingsAlerts => 'Ističe uskoro upozorenja';

  @override
  String get settingsAlertsDesc =>
      'Obavesti me kada giveaway ističe za manje od 6h';

  @override
  String get settingsAbout => 'O aplikaciji';

  @override
  String get welcomeTitle => 'Dobrodošli u\\nBalkan Giveaways!';

  @override
  String get welcomeDesc => 'Pronađi najbolje nagradne igre na Balkanu.';

  @override
  String get onboardingLang => 'Izaberi jezik interfejsa:';

  @override
  String get onboardingCountry => 'Prikaži mi nagradne igre iz:';

  @override
  String get onboardingOptional => '(Neobavezno)';

  @override
  String get onboardingStart => 'Započni!';

  @override
  String get detailAbout => 'O nagradnoj igri';

  @override
  String get detailMarkEntered => 'Označio sam kao prijavljeno';

  @override
  String get detailMarkDesc =>
      'Ovaj giveaway će biti sakriven ako uključiš filter \\\"Sakrij unete\\\"';

  @override
  String get detailGoToEntry => 'Idi na prijavu';
}
