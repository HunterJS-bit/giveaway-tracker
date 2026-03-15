import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../../models/giveaway.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._init();
  static Database? _database;

  DatabaseService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('giveaways.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 2,
      onCreate: _createDB,
      onUpgrade: _onUpgrade,
    );
  }

  Future _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await db.execute('ALTER TABLE favorites ADD COLUMN status TEXT NOT NULL DEFAULT "active"');
    }
  }

  Future _createDB(Database db, int version) async {
    const textType = 'TEXT NOT NULL';
    const boolType = 'INTEGER NOT NULL';
    const doubleType = 'REAL NOT NULL';
    const intType = 'INTEGER NOT NULL';

    await db.execute('''
CREATE TABLE favorites ( 
  id TEXT PRIMARY KEY,
  title $textType,
  brand $textType,
  brandLogoUrl $textType,
  imageUrl $textType,
  description $textType,
  prize $textType,
  prizeValue $doubleType,
  currency $textType,
  country $textType,
  category $textType,
  entryUrl $textType,
  startDate $textType,
  endDate $textType,
  isFeatured $boolType,
  isVerified $boolType,
  status $textType,
  entryCount $intType
  )
''');

  }

  Future<void> addFavorite(Giveaway giveaway) async {
    final db = await instance.database;
    await db.insert(
      'favorites',
      giveaway.toDbMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> removeFavorite(String id) async {
    final db = await instance.database;
    await db.delete(
      'favorites',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<List<Giveaway>> getFavorites() async {
    final db = await instance.database;
    final result = await db.query('favorites');

    return result.map((json) => Giveaway.fromDbMap(json)).toList();
  }

  Future close() async {
    final db = await instance.database;
    db.close();
  }
}
