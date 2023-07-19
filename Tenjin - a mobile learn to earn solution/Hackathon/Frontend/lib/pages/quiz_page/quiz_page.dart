import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/quiz_page/answer_correct_page.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

import 'controller/quiz_controller.dart';

class QuizPage extends GetView<QuizController> {
  const QuizPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(QuizController());
    return TenjinScaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(
              Icons.arrow_back,
              color: TenjinColors.white,
            ),
            onPressed: () {},
          ),
          title: Text(
            "Question",
            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.white),
          ),
          centerTitle: true,
          backgroundColor: Colors.transparent,
        ),
        body: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: EdgeInsets.all(getRelativeWidth(10)),
                  color: TenjinColors.pink,
                  child: Obx(
                    () => Text(
                      "Question ${controller.currentQuestionIndex.value + 1}/${controller.questionList.length}",
                      style: TenjinTypography.interMed22.copyWith(color: TenjinColors.black),
                    ),
                  ),
                ),
                Row(
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(vertical: getRelativeHeight(4), horizontal: getRelativeWidth(15)),
                      decoration: BoxDecoration(color: TenjinColors.orange, borderRadius: BorderRadius.circular(22)),
                      child: Obx(
                        () => Text(
                          controller.xp.value.toString(),
                          style: TenjinTypography.interMed14.copyWith(color: TenjinColors.black),
                        ),
                      ),
                    ),
                    SizedBox(
                      width: getRelativeWidth(5),
                    ),
                    Text(
                      "XP",
                      style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                    )
                  ],
                )
              ],
            ),
            Obx(
              () => controller.answerValidate.value ? const Expanded(child: SizedBox()) : const SizedBox(),
            ),
            Obx(
              () => controller.answerValidate.value
                  ? AnswerValidation(answerWasCorrect: controller.questionList[controller.currentQuestionIndex.value].answerList[controller.selectedAnswerIndex.value].correctAnswer, explaination: controller.questionList[controller.currentQuestionIndex.value].explaination)
                  : Column(
                      children: [
                        SizedBox(
                          height: getRelativeHeight(28),
                        ),
                        SizedBox(
                          height: MediaQuery.of(context).size.height * 0.1,
                          child: Obx(
                            () => AutoSizeText(
                              controller.questionList[controller.currentQuestionIndex.value].question,
                              style: TenjinTypography.interMed22.copyWith(color: TenjinColors.white),
                            ),
                          ),
                        ),
                        SizedBox(
                          height: getRelativeHeight(28),
                        ),
                        Obx(
                          () => Column(
                            children: List.generate(
                              controller.questionList[controller.currentQuestionIndex.value].answerList.length,
                              (index) => GestureDetector(
                                onTap: () => controller.selectedAnswerIndex.value = index,
                                child: Obx(
                                  () => Container(
                                    height: getRelativeHeight(70),
                                    margin: EdgeInsets.symmetric(
                                      vertical: getRelativeHeight(10),
                                    ),
                                    child: Row(
                                      children: [
                                        Container(
                                          height: double.infinity,
                                          padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(11)),
                                          alignment: Alignment.center,
                                          decoration: BoxDecoration(
                                            color: controller.selectedAnswerIndex.value == index ? TenjinColors.orange : TenjinColors.black,
                                            border: Border.all(color: controller.selectedAnswerIndex.value == index ? TenjinColors.orange : TenjinColors.white),
                                            borderRadius: const BorderRadius.only(
                                              topLeft: Radius.circular(15),
                                              bottomLeft: Radius.circular(15),
                                            ),
                                          ),
                                          child: Text(
                                            controller.abc[index],
                                            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.white),
                                          ),
                                        ),
                                        Expanded(
                                          child: Container(
                                            height: double.infinity,
                                            padding: EdgeInsets.all(getRelativeWidth(16)),
                                            decoration: BoxDecoration(
                                              border: Border.all(color: controller.selectedAnswerIndex.value == index ? TenjinColors.orange : TenjinColors.white),
                                              borderRadius: const BorderRadius.only(
                                                topRight: Radius.circular(15),
                                                bottomRight: Radius.circular(15),
                                              ),
                                            ),
                                            child:
                                                //wrap with fitted box to prevent overflow
                                                AutoSizeText(
                                              controller.questionList[controller.currentQuestionIndex.value].answerList[index].answer,
                                              maxLines: 2,
                                              minFontSize: 8,
                                              style: TenjinTypography.interMed22.copyWith(color: controller.selectedAnswerIndex.value == index ? TenjinColors.orange : TenjinColors.white),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(
                          height: getRelativeHeight(44),
                        ),
                      ],
                    ),
            ),
            const Expanded(child: SizedBox()),
            Padding(
              padding: EdgeInsets.only(bottom: getRelativeHeight(10)),
              child: GestureDetector(
                onTap: () async => controller.answerValidate.value ? controller.nextQuestion() : await controller.validateAnswer(),
                child: Container(
                  width: double.infinity,
                  padding: EdgeInsets.symmetric(
                    vertical: getRelativeHeight(15),
                  ),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    border: Border.all(color: TenjinColors.white),
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: Obx(
                    () => Text(
                      controller.answerValidate.value ? "Next question" : "Check answer",
                      style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                    ),
                  ),
                ),
              ),
            )
          ],
        ));
  }
}
