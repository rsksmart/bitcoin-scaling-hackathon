import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/quiz_page/controller/quiz_controller.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class AnswerValidation extends StatelessWidget {
  const AnswerValidation({required this.answerWasCorrect, this.explaination, super.key});

  final bool answerWasCorrect;
  final String? explaination;

  @override
  Widget build(BuildContext context) {
    Get.find<QuizController>();
    return Container(
      padding: EdgeInsets.all(getRelativeWidth(20)),
      decoration: BoxDecoration(
        border: Border.all(color: TenjinColors.white),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: getRelativeWidth(224),
                color: TenjinColors.orange,
                padding: EdgeInsets.symmetric(vertical: getRelativeHeight(10)),
                child: Text(
                  answerWasCorrect ? "You got it right" : "Oops! That's not the correct answer",
                  textAlign: TextAlign.center,
                  style: TenjinTypography.interMed22.copyWith(color: TenjinColors.black),
                ),
              ),
              Container(
                padding: EdgeInsets.all(getRelativeWidth(5)),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                  color: TenjinColors.pink,
                ),
                child: Text(
                  "${answerWasCorrect ? "+ 15" : 0} XP",
                  style: TenjinTypography.interMed14.copyWith(color: TenjinColors.black),
                ),
              )
            ],
          ),
          SizedBox(
            height: getRelativeHeight(20),
          ),
          answerWasCorrect
              ? Text(
                  "Your knowledge is impressive! Keep going!",
                  style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                )
              : explaination != "" ? Text.rich(
                  TextSpan(
                    text: "Explanation: ",
                    style: TenjinTypography.interMed14.copyWith(color: TenjinColors.green),
                    children: [
                      TextSpan(
                        text: explaination,
                        style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                      ),
                    ],
                  ),
                ) : const SizedBox(),
          SizedBox(
            height: getRelativeHeight(20),
          ),
          Image.asset("assets/icons/rootstock_icon.png")
        ],
      ),
    );
  }
}
