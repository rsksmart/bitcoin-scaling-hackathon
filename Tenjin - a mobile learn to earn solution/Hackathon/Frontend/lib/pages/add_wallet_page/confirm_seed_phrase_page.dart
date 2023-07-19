import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/controller/add_wallet_controller.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/widgets/word.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class ConfirmSeedPhrasePage extends GetView<AddWalletController> {
  const ConfirmSeedPhrasePage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(AddWalletController());
    return TenjinScaffold(
      appBar: AppBar(
        centerTitle: true,
        backgroundColor: Colors.transparent,
        foregroundColor: TenjinColors.white,
        title: Text(
          'Add wallet',
          style: TenjinTypography.interMed22.copyWith(
            color: TenjinColors.white,
          ),
        ),
      ),
      enableBottomNavBar: true,
      body: Center(
        child: Obx(
          () => Column(
            children: [
              Text(
                'Tap the secret words to order them correctly',
                style: TenjinTypography.interMed14.copyWith(
                  color: TenjinColors.white,
                ),
              ),
              const Spacer(),
              if (controller.enteredSeedPhrase.isNotEmpty)
                Wrap(
                  spacing: getRelativeWidth(20),
                  runSpacing: getRelativeHeight(10),
                  children: List.generate(
                    controller.enteredSeedPhrase.length,
                    (index) => Word(
                      index: index + 1,
                      word: controller.enteredSeedPhrase[index],
                      onTap: (word) {
                        controller.enteredSeedPhrase.remove(word);
                        controller.randomSeedPhrase.add(word);
                      },
                    ),
                  ),
                ),
              if (controller.enteredSeedPhrase.isNotEmpty && controller.randomSeedPhrase.isNotEmpty) SizedBox(height: getRelativeHeight(50)),
              if (controller.randomSeedPhrase.isNotEmpty)
                Wrap(
                  spacing: getRelativeWidth(20),
                  runSpacing: getRelativeHeight(10),
                  children: List.generate(
                    controller.randomSeedPhrase.length,
                    (index) => Word(
                      index: index + 1,
                      word: controller.randomSeedPhrase[index],
                      onTap: (word) {
                        controller.randomSeedPhrase.remove(word);
                        controller.enteredSeedPhrase.add(word);
                      },
                      showIndex: false,
                    ),
                  ),
                ),
              const Spacer(),
              Text(
                controller.errorMsg.value,
                style: TenjinTypography.interMed14.copyWith(
                  color: TenjinColors.red,
                ),
              ),
              SizedBox(height: getRelativeHeight(20)),
              TenjinButton(
                text: 'Add wallet',
                onPressed: () => controller.checkSeedPhrase(),
              ),
              SizedBox(height: getRelativeHeight(30)),
            ],
          ),
        ),
      ),
    );
  }
}
