class UserProfile {
  final int id;
  final String username;
  final String? walletAddress;
  final String? avatar;

  UserProfile({required this.id, required this.username, this.walletAddress, this.avatar});

  UserProfile.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        username = json['username'],
        walletAddress = json['wallet_address'],
        avatar = json['avatar'];
}
