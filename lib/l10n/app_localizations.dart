import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_bs.dart';
import 'app_localizations_hr.dart';
import 'app_localizations_sr.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('bs'),
    Locale('hr'),
    Locale('sr'),
    Locale.fromSubtags(languageCode: 'sr', scriptCode: 'Latn')
  ];

  /// No description provided for @appTitle.
  ///
  /// In sr, this message translates to:
  /// **'Balkan Giveaways'**
  String get appTitle;

  /// No description provided for @feedTab.
  ///
  /// In sr, this message translates to:
  /// **'Ленд'**
  String get feedTab;

  /// No description provided for @endingSoonTab.
  ///
  /// In sr, this message translates to:
  /// **'Истиче Ускоро'**
  String get endingSoonTab;

  /// No description provided for @settingsTab.
  ///
  /// In sr, this message translates to:
  /// **'Поставке'**
  String get settingsTab;

  /// No description provided for @filters.
  ///
  /// In sr, this message translates to:
  /// **'Филтери'**
  String get filters;

  /// No description provided for @hideEntered.
  ///
  /// In sr, this message translates to:
  /// **'Сакриј унете'**
  String get hideEntered;

  /// No description provided for @sponsored.
  ///
  /// In sr, this message translates to:
  /// **'Спонзорисано'**
  String get sponsored;

  /// No description provided for @expiresIn.
  ///
  /// In sr, this message translates to:
  /// **'Истиче за {hours}h'**
  String expiresIn(Object hours);

  /// No description provided for @prizePrefix.
  ///
  /// In sr, this message translates to:
  /// **'Награда:'**
  String get prizePrefix;

  /// No description provided for @entriesCount.
  ///
  /// In sr, this message translates to:
  /// **'{count} пријава'**
  String entriesCount(Object count);

  /// No description provided for @enteredBtn.
  ///
  /// In sr, this message translates to:
  /// **'Унето'**
  String get enteredBtn;

  /// No description provided for @enterBtn.
  ///
  /// In sr, this message translates to:
  /// **'Пријави се'**
  String get enterBtn;

  /// No description provided for @noGiveaways.
  ///
  /// In sr, this message translates to:
  /// **'Нема наградних игара за ове филтере.'**
  String get noGiveaways;

  /// No description provided for @endingSoonTitle.
  ///
  /// In sr, this message translates to:
  /// **'Истиче ускоро (< 6h)'**
  String get endingSoonTitle;

  /// No description provided for @noEndingSoon.
  ///
  /// In sr, this message translates to:
  /// **'Тренутно нема наградних игара које истичу у наредних 6 сати.'**
  String get noEndingSoon;

  /// No description provided for @settingsAppearance.
  ///
  /// In sr, this message translates to:
  /// **'Изглед'**
  String get settingsAppearance;

  /// No description provided for @settingsTheme.
  ///
  /// In sr, this message translates to:
  /// **'Тема'**
  String get settingsTheme;

  /// No description provided for @settingsLanguage.
  ///
  /// In sr, this message translates to:
  /// **'Језик апликације'**
  String get settingsLanguage;

  /// No description provided for @settingsNotifications.
  ///
  /// In sr, this message translates to:
  /// **'Нотификације'**
  String get settingsNotifications;

  /// No description provided for @settingsAlerts.
  ///
  /// In sr, this message translates to:
  /// **'Истиче ускоро упозорења'**
  String get settingsAlerts;

  /// No description provided for @settingsAlertsDesc.
  ///
  /// In sr, this message translates to:
  /// **'Обавести ме када giveaway истиче за мање од 6h'**
  String get settingsAlertsDesc;

  /// No description provided for @settingsAbout.
  ///
  /// In sr, this message translates to:
  /// **'О апликацији'**
  String get settingsAbout;

  /// No description provided for @welcomeTitle.
  ///
  /// In sr, this message translates to:
  /// **'Добродошли у\\nBalkan Giveaways!'**
  String get welcomeTitle;

  /// No description provided for @welcomeDesc.
  ///
  /// In sr, this message translates to:
  /// **'Пронађи најбоље наградне игре на Балкану.'**
  String get welcomeDesc;

  /// No description provided for @onboardingLang.
  ///
  /// In sr, this message translates to:
  /// **'Изабери језик интерфејса:'**
  String get onboardingLang;

  /// No description provided for @onboardingCountry.
  ///
  /// In sr, this message translates to:
  /// **'Прикажи ми наградне игре из:'**
  String get onboardingCountry;

  /// No description provided for @onboardingOptional.
  ///
  /// In sr, this message translates to:
  /// **'(Необавезно)'**
  String get onboardingOptional;

  /// No description provided for @onboardingStart.
  ///
  /// In sr, this message translates to:
  /// **'Започни!'**
  String get onboardingStart;

  /// No description provided for @detailAbout.
  ///
  /// In sr, this message translates to:
  /// **'О наградној игри'**
  String get detailAbout;

  /// No description provided for @detailMarkEntered.
  ///
  /// In sr, this message translates to:
  /// **'Означио сам као пријављено'**
  String get detailMarkEntered;

  /// No description provided for @detailMarkDesc.
  ///
  /// In sr, this message translates to:
  /// **'Овај giveaway ће бити сакривен ако укључиш филтер \\\"Сакриј унете\\\"'**
  String get detailMarkDesc;

  /// No description provided for @detailGoToEntry.
  ///
  /// In sr, this message translates to:
  /// **'Иди на пријаву'**
  String get detailGoToEntry;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['bs', 'hr', 'sr'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when language+script codes are specified.
  switch (locale.languageCode) {
    case 'sr':
      {
        switch (locale.scriptCode) {
          case 'Latn':
            return AppLocalizationsSrLatn();
        }
        break;
      }
  }

  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'bs':
      return AppLocalizationsBs();
    case 'hr':
      return AppLocalizationsHr();
    case 'sr':
      return AppLocalizationsSr();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
