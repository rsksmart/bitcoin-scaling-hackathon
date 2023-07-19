import 'answer_model.dart';

class Question {
  final int id;
  final String question;
  final List<Answer> answerList;
  final String? explaination;

  Question({required this.id, required this.question, required this.answerList,this.explaination });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'],
      question: json['question_name'],
      answerList: createAnswerList(json['options']),
      explaination: json['explanation']
    );
  }

  static createAnswerList(List<dynamic> json) {
    List<Answer> answerListJson = [];
    for (var i=0; json.length > i; i++) {
      answerListJson.add(Answer.fromJson(json[i]));
    }
    return answerListJson;
  }
}
