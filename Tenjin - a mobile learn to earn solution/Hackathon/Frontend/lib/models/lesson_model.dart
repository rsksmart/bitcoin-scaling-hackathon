import 'package:tenjin_rootstock_all/models/class_model.dart';

class Lesson {
  final int id;
  final bool isCompleted;
  final bool isStarted;
  final String title;
  final int sequence;
  final List<Class> classList;
  final String description;

  Lesson({required this.id, required this.isCompleted, required this.description, required this.title, required this.sequence, required this.classList, required this.isStarted});

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'],
      isCompleted: json['is_completed'],
      isStarted: json['is_started'] ?? false,
      title: json['title'],
      description: json['description'],
      sequence: json['sequence'],
      classList: createClassList(json['classes'])
    );
  }

  static createClassList(List<dynamic> json) {
    List<Class> classListJson = []; 
    for (var i=0; json.length > i; i++) {
      classListJson.add(Class.fromJson(json[i]));
    }
    return classListJson;
  }
}