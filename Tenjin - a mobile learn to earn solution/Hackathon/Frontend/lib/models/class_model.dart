import 'question_model.dart';

class Class {
  final int id;
  final String title;
  final int sequence;
  final String illustrationImage;
  final bool completed;
  final bool started;
  List<Question> questionList = [];

  Class({required this.id, required this.title, required this.sequence, required this.questionList, required this.illustrationImage, required this.completed, required this.started});

  factory Class.fromJson(Map<String, dynamic> json) {
    return Class(id: json['id'], 
    title: json['title'] ?? "",
     sequence: json['sequence'] ?? -1, 
     completed: json['is_completed'] ?? false, 
     started: json['is_started'] ?? false, 
     illustrationImage: json['illustration_image'] ?? "", 
     questionList: json['question_list'] != null ? List.generate(json['question_list'].length, (index) => Question.fromJson(json['question_list'][index])) : []);
  }
}
