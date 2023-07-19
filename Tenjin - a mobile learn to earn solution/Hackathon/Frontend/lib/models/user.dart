class User {
  final int id;
  final String email;

  User({required this.id, required this.email});

  User.fromJson(Map<String, dynamic> json)
      : id = json['id'] ?? json['pk'],
        email = json['email'];
  Map<String, dynamic> toJson() => {
        "id": id,
        "email": email,
      };
}