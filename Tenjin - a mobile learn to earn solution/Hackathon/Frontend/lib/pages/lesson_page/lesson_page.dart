import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/controllers/learn_controller.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/learn_page.dart';
import 'package:tenjin_rootstock_all/pages/quiz_page/controller/quiz_controller.dart';
import 'package:tenjin_rootstock_all/pages/quiz_page/quiz_page.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

import '../widgets/tenjin_button.dart';
import 'controller/lesson_controller.dart';

class LessonPage extends GetView<LessonController> {
  const LessonPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(LessonController());

    QuizController quizController = Get.put(QuizController());
    return TenjinScaffold(
        appBar: AppBar(
          centerTitle: false,
          title: Container(
            padding: EdgeInsets.all(getRelativeWidth(2)),
            decoration: BoxDecoration(
              color: TenjinColors.pink,
              borderRadius: BorderRadius.circular(22),
            ),
            child: Obx(
              () => Text(
                "Chapter ${controller.chapterSequence}",
                style: TenjinTypography.interMed14.copyWith(color: TenjinColors.black),
              ),
            ),
          ),
          leading: IconButton(
              onPressed: () async {
                await Get.put(LearnController()).fetchLessonList();
                Get.to(() => const LearnPage(), duration: Duration.zero);
              },
              icon: const Icon(
                Icons.arrow_back,
                color: TenjinColors.white,
              )),
          backgroundColor: Colors.transparent,
        ),
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Obx(
                  () => Text(controller.lesson.value!.title,
                      style: TenjinTypography.interMed22.copyWith(
                        color: TenjinColors.white,
                      )),
                ),
              ),
              SizedBox(
                height: getRelativeHeight(35),
              ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(30)),
                child: Obx(
                  () => Row(
                    mainAxisAlignment: controller.lesson.value!.classList.length == 1 ? MainAxisAlignment.center: MainAxisAlignment.spaceBetween,
                    children: List.generate(
                      controller.lesson.value!.classList.length,
                      (index) => LessonNumberContainer(sequenceNumber: index + 1),
                    ),
                  ),
                ),
              ),
              SizedBox(
                height: getRelativeHeight(5),
              ),
              Obx(() => Image.network(controller.lesson.value!.classList[controller.selectedLessonIndex.value].illustrationImage)),
              TenjinButton(
                text: 'Start Quiz',
                onPressed: () async {
                  await quizController.reset();
                  await quizController.init(controller.lesson.value!.classList[controller.selectedLessonIndex.value].id);
                  if (quizController.questionList.isEmpty) return;
                  Get.to(() => const QuizPage());
                },
              ),
              SizedBox(
                height: getRelativeHeight(30),
              )
            ],
          ),
        ));
  }
}

class LessonNumberContainer extends StatelessWidget {
  const LessonNumberContainer({
    required this.sequenceNumber,
    super.key,
  });

  final int sequenceNumber;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (Get.find<LessonController>().lesson.value!.classList.firstWhereOrNull((element) => !element.started && !element.completed) == null ||
            sequenceNumber-1 < Get.find<LessonController>().lesson.value!.classList.firstWhereOrNull((element) => !element.started)!.sequence) {
          Get.find<LessonController>().selectedLessonIndex.value = sequenceNumber - 1;
        } else {
          Get.defaultDialog(
            title: 'Lesson Locked',
            middleText: 'Please complete the current lesson to unlock this lesson',
            titlePadding: EdgeInsets.only(top: getRelativeHeight(20)),
            contentPadding: EdgeInsets.symmetric(
              vertical: getRelativeHeight(20),
            ),
            textConfirm: 'OK',
            confirmTextColor: TenjinColors.white,
            onConfirm: () => Get.back(),
            buttonColor: TenjinColors.orange,
          );
        }
      },
      child: Obx(
        () => Container(
          decoration: BoxDecoration(
            color: sequenceNumber - 1 == Get.find<LessonController>().selectedLessonIndex.value ? TenjinColors.orange : TenjinColors.white20,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Padding(
            padding: EdgeInsets.all(getRelativeWidth(10)),
            child: Text(
              'Lesson $sequenceNumber',
              style: TenjinTypography.interMed14.copyWith(color: TenjinColors.black),
            ),
          ),
        ),
      ),
    );
  }
}
