class UserLeaderboard {
  final int id;
  final String user;
  final int xp;
  final String? avatar;

  UserLeaderboard({required this.id, required this.user, required this.xp, this.avatar});

  factory UserLeaderboard.fromJson(Map<String, dynamic> json) {
    return UserLeaderboard(
      id: json['id'],
      user: json['user'],
      xp: json['xp'],
      avatar: json['avatar']
    );
  }
}