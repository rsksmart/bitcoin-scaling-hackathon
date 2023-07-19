import 'dart:math';

class UserStatistics {
  final int id;
  final double levelPercentage;
  final int level;
  final int totalXp;
  final BigInt rbtc;
  final int currentCategory;
  final int user;

  UserStatistics({required this.id, required this.levelPercentage, required this.level, required this.totalXp, required this.rbtc, required this.currentCategory, required this.user});

  get rbtcBalance => rbtc.toDouble() / pow(10, 18);

  factory UserStatistics.fromJson(Map<String, dynamic> json) {
    return UserStatistics(
      id: json['id'],
      levelPercentage: double.parse(json['level_percentage']),
      level: json['level'],
      totalXp: json['total_xp'],
      rbtc: BigInt.parse(json['RBTC']),
      currentCategory: json['current_category'],
      user: json['user'],
    );
  }
}
