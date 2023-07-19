import 'package:get/get.dart';

import '../../../models/lesson_model.dart';

class LessonController extends GetxController {
  RxInt selectedLessonIndex = 0.obs;

  RxString chapterName = ''.obs;
  RxInt chapterSequence = (-1).obs;
  Rxn<Lesson> lesson = Rxn<Lesson>();
}
