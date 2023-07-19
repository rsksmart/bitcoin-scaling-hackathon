import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/confirm_seed_phrase_page.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/controller/add_wallet_controller.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/widgets/word.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class AddWalletPage extends GetView<AddWalletController> {
  const AddWalletPage({super.key});

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
        child: Column(
          children: [
            Text(
              'Make sure you save these secret words',
              style: TenjinTypography.interMed14.copyWith(
                color: TenjinColors.white,
              ),
            ),
            const Spacer(),
            Wrap(
              spacing: getRelativeWidth(20),
              runSpacing: getRelativeHeight(10),
              children: List.generate(
                controller.seedPhrase.length,
                (index) => Word(
                  index: index + 1,
                  word: controller.seedPhrase[index],
                ),
              ),
            ),
            const Spacer(),
            TenjinButton(
              text: 'Add wallet',
              onPressed: () => Get.to(
                () => const ConfirmSeedPhrasePage(),
                duration: Duration.zero,
              ),
            ),
            SizedBox(height: getRelativeHeight(30)),
          ],
        ),
      ),
    );
  }
}
