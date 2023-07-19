import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/models/question_model.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/add_wallet_page.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/class_fail_page.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/class_loot_box_page.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/class_success_page.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/controller/class_end_controller.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/controllers/learn_controller.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/learn_page.dart';
import 'package:tenjin_rootstock_all/pages/lesson_page/controller/lesson_controller.dart';
import 'package:tenjin_rootstock_all/pages/lesson_page/lesson_page.dart';
import 'package:tenjin_rootstock_all/services/teaching_material_service.dart';

class QuizController extends GetxController {
  RxInt xp = 0.obs;
  RxInt currentQuestionIndex = 0.obs;
  RxInt selectedAnswerIndex = (-1).obs;
  RxBool answerValidate = false.obs;
  TeachingMaterialService teachingMaterialService = Get.find<TeachingMaterialService>();
  LessonController lessonController = Get.find<LessonController>();
  ClassEndController classEndController = Get.put(ClassEndController());

  String abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  RxList<Question> questionList = <Question>[].obs;

  reset() {
    xp.value = 0;
    currentQuestionIndex.value = 0;
    selectedAnswerIndex.value = -1;
    answerValidate.value = false;
  }

  Future validateAnswer() async {
    await teachingMaterialService.addClassRecord(questionList[currentQuestionIndex.value].id, questionList[currentQuestionIndex.value].answerList[selectedAnswerIndex.value].id);
    if (selectedAnswerIndex.value == -1) {
      return;
    }
    if (questionList[currentQuestionIndex.value].answerList[selectedAnswerIndex.value].correctAnswer) {
      xp.value += 15;
    }
    answerValidate.value = true;
  }

  Future nextQuestion() async {
    if (currentQuestionIndex.value < questionList.length - 1) {
      currentQuestionIndex.value++;
      selectedAnswerIndex.value = -1;
      answerValidate.value = false;
    } else {
      Map data = await teachingMaterialService.getClassScore(lessonController.lesson.value!.classList[lessonController.selectedLessonIndex.value].id);
      int score = data['score'];
      var lootbox = data['loot_box'];

      classEndController.score.value = score;
      classEndController.xpCollected.value = data['xp_collected'];
      classEndController.totalQuestions.value = questionList.length;

      if (score > questionList.length * 0.5) {
        if (lootbox != null) {
          Get.to(
            () => ClassLootBoxPage(
              rbtc: lootbox['RBTC'],
              onTap: () async {
                {
                  if (lessonController.selectedLessonIndex.value + 1 < lessonController.lesson.value!.classList.length) {
                    Get.put(LessonController()).selectedLessonIndex.value += 1;
                    Get.off(() => const LessonPage());
                  } else {
                    await Get.put(LearnController()).fetchLessonList();
                    if (lessonController.lesson.value?.title == "Create your own wallet") {
                      Get.to(() => const AddWalletPage());
                    } else {
                      Get.off(() => const LearnPage());
                    }
                  }
                }
              },
            ),
          );
        } else {
          Get.to(
            () => ClassSuccessPage(
              onTap: () async {
                if (lessonController.selectedLessonIndex.value + 1 < lessonController.lesson.value!.classList.length) {
                  Get.put(LessonController()).selectedLessonIndex.value += 1;
                  Get.off(() => const LessonPage());
                } else {
                  await Get.put(LearnController()).fetchLessonList();
                  if (lessonController.lesson.value?.title == "Create your own wallet") {
                    Get.to(() => const AddWalletPage());
                  } else {
                    Get.off(() => const LearnPage());
                  }
                }
              },
            ),
          );
        }
      } else {
        Get.to(
          () => ClassFailPage(
            onTap: () => Get.off(() => const LessonPage()),
          ),
        );
      }
    }
  }

  init(int classId) async {
    questionList.value = (await teachingMaterialService.getQuestionsFromClass(classId)).questionList;
  }
}
