import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/controller/class_end_controller.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/models/floating_word.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/widgets/floating_text_card.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';
import 'dart:math' as math;

class ClassLootBoxPage extends GetView<ClassEndController> {
  const ClassLootBoxPage({required this.rbtc, required this.onTap, super.key});

  final Function() onTap;
  final int rbtc;

  Widget _generateLootBoxWord(FloatingWord word, double dx, double dy, double angle) => Center(
        child: Transform.translate(
          offset: Offset(dx, dy),
          child: Transform.rotate(
            angle: angle,
            child: FloatingTextCard(
              color: word.color,
              text: word.text,
            ),
          ),
        ),
      );

  @override
  Widget build(BuildContext context) {
    Get.put(ClassEndController());
    final screenSize = MediaQuery.of(context).size;
    return TenjinScaffold(
      removeHorizontalPadding: true,
      body: Column(
        children: [
          SizedBox(height: screenSize.height * 0.04),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(15)),
            child: Card(
              margin: EdgeInsets.zero,
              color: TenjinColors.orange,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(2.0),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Padding(
                      padding: EdgeInsets.all(screenSize.width * 0.03),
                      child: AutoSizeText(
                        'Congratulations 🎉\nYou\'ve discovered a Loot Box!',
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        minFontSize: 8.0,
                        style: TenjinTypography.interMed14.copyWith(fontSize: 22.0),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: screenSize.height * 0.03),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(15)),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'Unleash the excitement! Discover to reveal incredible surprises and rewards.',
                    style: TenjinTypography.interMed14.copyWith(
                      color: TenjinColors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: screenSize.height * 0.03),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(15)),
            child: Row(
              children: [
                Text(
                  'Your Score',
                  style: TenjinTypography.interMed14.copyWith(
                    color: TenjinColors.white,
                  ),
                ),
                SizedBox(width: screenSize.width * 0.04),
                Obx(
                  () => FloatingTextCard(
                    color: TenjinColors.pink,
                    text: '${controller.score.value}/${controller.totalQuestions.value}',
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: screenSize.height * 0.03),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(15)),
            child: Row(
              children: [
                Text(
                  'XP Collected',
                  style: TenjinTypography.interMed14.copyWith(
                    color: TenjinColors.white,
                  ),
                ),
                SizedBox(width: screenSize.width * 0.04),
                Obx(
                  () => FloatingTextCard(
                    color: TenjinColors.green,
                    text: '+${controller.xpCollected.value} XP',
                  ),
                ),
              ],
            ),
          ),
                    SizedBox(height: screenSize.height * 0.03),

          Padding(
            padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(15)),
            child: Row(
              children: [
                Text(
                  'RBTCs Collected',
                  style: TenjinTypography.interMed14.copyWith(
                    color: TenjinColors.white,
                  ),
                ),
                SizedBox(width: screenSize.width * 0.04),
               FloatingTextCard(
                    color: TenjinColors.pink,
                    text: '$rbtc',
                  ),
              
              ],
            ),
          ),
          SizedBox(height: screenSize.height * 0.02),
          Expanded(
            child: Stack(
              children: [
                Center(
                  child: Padding(
                    padding: EdgeInsets.all(screenSize.width * 0.2),
                    child: Image.asset('assets/images/lootbox.png'),
                  ),
                ),
                _generateLootBoxWord(controller.floatingWordsReward[0], screenSize.width * 0.16, -screenSize.height * 0.08, -math.pi / 3.5),
                _generateLootBoxWord(controller.floatingWordsReward[1], -screenSize.width * 0.14, -screenSize.height * 0.015, math.pi / 12),
                _generateLootBoxWord(controller.floatingWordsReward[2], -screenSize.width * 0.13, -screenSize.height * 0.075, math.pi / 6),
                _generateLootBoxWord(controller.floatingWordsReward[3], screenSize.width * 0.14, -screenSize.height * 0.012, -math.pi / 10),
                _generateLootBoxWord(controller.floatingWordsReward[4], screenSize.width * 0.04, -screenSize.height * 0.08, -math.pi / 2.3),
              ],
            ),
          ),
          SizedBox(height: screenSize.height * 0.02),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: getRelativeWidth(15)),
            child: TenjinButton(
              text: 'Continue the journey',
              onPressed: () => onTap.call(),
            ),
          ),
          SizedBox(height: screenSize.height * 0.03),
        ],
      ),
    );
  }
}
