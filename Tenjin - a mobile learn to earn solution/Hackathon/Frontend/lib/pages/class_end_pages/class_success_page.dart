import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/controller/class_end_controller.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/widgets/bouncing_area.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/widgets/floating_text_card.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class ClassSuccessPage extends GetView<ClassEndController> {
  const ClassSuccessPage({required this.onTap, super.key});

  final Function() onTap;

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
                        'Congratulations 🎉\nClass completed!',
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
                    'You\'re now a bitcoin wallet wizard! Ready to take on the crypto world!',
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
          SizedBox(height: screenSize.height * 0.02),
          Expanded(
            child: BouncingArea(
              success: true,
              //height: controller.bouncingAreaHeight,
              //width: controller.bouncingAreaWidth,
              child: Center(
                child: Padding(
                  padding: EdgeInsets.all(screenSize.width * 0.14),
                  child: Image.asset('assets/images/growth.png'),
                ),
              ),
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
