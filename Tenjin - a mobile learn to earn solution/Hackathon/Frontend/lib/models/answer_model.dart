class Answer {
  final int id;
  final int questionId;
  final String answer;
  final bool correctAnswer; 

  Answer({required this.id, required this.questionId, required this.answer, required this.correctAnswer});

  factory Answer.fromJson(Map<String, dynamic> json) {
    return Answer(
      id: json['answerID'],
      questionId: json['class_questionID'],
      answer: json['answer_option'],
      correctAnswer: json['correct_answer'],
    );
  }
}