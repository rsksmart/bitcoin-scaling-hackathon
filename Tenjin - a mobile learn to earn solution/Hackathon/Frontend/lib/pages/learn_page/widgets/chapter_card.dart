import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/models/lesson_model.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/controllers/learn_controller.dart';
import 'package:tenjin_rootstock_all/pages/lesson_page/controller/lesson_controller.dart';
import 'package:tenjin_rootstock_all/pages/lesson_page/lesson_page.dart';
import 'package:tenjin_rootstock_all/services/teaching_material_service.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class ChapterCard extends StatelessWidget {
  const ChapterCard({super.key, required this.chapter, required this.chapterNumber, required this.chapterTitle, required this.progress, required this.totalParts, required this.chapterDescription, required this.chapterNumberColor, required this.chapterTitleColor});
  final int chapterNumber;
  final String chapterTitle;
  final int progress;
  final int totalParts;
  final String chapterDescription;
  final Color chapterNumberColor;
  final Color chapterTitleColor;
  final Lesson chapter;

  @override
  Widget build(BuildContext context) {
    LearnController learnController = Get.find<LearnController>();
    LessonController lessonController = Get.put(LessonController());
    TeachingMaterialService teachingMaterialService = Get.put(TeachingMaterialService());

    return GestureDetector(
      onTap: () {
        if (chapterNumber > 1) {
          if (learnController.lessonList[chapterNumber - 2].isCompleted) {
            lessonController.chapterSequence.value = chapterNumber;
            lessonController.lesson.value = learnController.lessonList[chapterNumber - 1];
            if (lessonController.lesson.value!.classList.isEmpty) return;
            if (!learnController.lessonList[chapterNumber - 1].isStarted) {
              teachingMaterialService.startCategoryById(chapter.id);
            }
            lessonController.selectedLessonIndex.value = 0;
            Get.to(() => const LessonPage());
          } else {
            Get.defaultDialog(
              title: 'Chapter Locked',
              middleText: 'Please complete the previous chapter to unlock this chapter',
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
        } else {
          if (!learnController.lessonList[chapterNumber - 1].isStarted) {
            teachingMaterialService.startCategoryById(chapter.id);
          }
          lessonController.chapterSequence.value = chapterNumber;
          lessonController.lesson.value = learnController.lessonList[chapterNumber - 1];
          if (lessonController.lesson.value!.classList.isEmpty) return;
          lessonController.selectedLessonIndex.value = 0;
          Get.to(() => const LessonPage());
        }
      },
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
            color: TenjinColors.white,
            width: 1,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(15),
                      color: chapterNumberColor,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(5),
                      child: Text(
                        'Chapter $chapterNumber',
                        style: TenjinTypography.interMed14,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    progress.toString(),
                    style: TenjinTypography.interMed14.copyWith(color: (progress == 0) ? TenjinColors.white20 : TenjinColors.white),
                  ),
                  Text(
                    '/$totalParts',
                    style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white20),
                  ),
                ],
              ),
              const SizedBox(
                height: 10,
              ),
              Container(
                decoration: BoxDecoration(
                  color: chapterTitleColor,
                ),
                child: Padding(
                  padding: const EdgeInsets.all(5),
                  child: Text(
                    chapterTitle,
                    style: TenjinTypography.interMed22,
                  ),
                ),
              ),
              const SizedBox(
                height: 34,
              ),
              Text(
                chapterDescription,
                style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
              ),
              SizedBox(
                height: getRelativeHeight(20),
              ),
              ...List.generate(
                chapter.classList.length,
                (index) => Padding(
                  padding: EdgeInsets.symmetric(vertical: getRelativeHeight(10)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text(
                            (index + 1).toString(),
                            style: TenjinTypography.interMed14.copyWith(color: TenjinColors.orange),
                          ),
                          SizedBox(
                            width: getRelativeWidth(10),
                          ),
                          Text(
                            chapter.classList[index].title,
                            style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                          ),
                        ],
                      ),
                      if (chapter.classList[index].completed) const Icon(Icons.check_circle, color: TenjinColors.orange),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
