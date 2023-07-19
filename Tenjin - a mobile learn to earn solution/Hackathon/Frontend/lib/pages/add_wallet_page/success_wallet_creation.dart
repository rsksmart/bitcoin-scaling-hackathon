import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

import '../learn_page/learn_page.dart';

class SuccessWalletCreation extends StatelessWidget {
  const SuccessWalletCreation({super.key});

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async => false,
      child: TenjinScaffold(
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          foregroundColor: TenjinColors.white,
          automaticallyImplyLeading: false,
        ),
        body: Column(
          children: [
            const Spacer(),
            Container(
              color: TenjinColors.orange,
              padding: const EdgeInsets.all(10),
              child: Text(
                'Congratulations! \n Your lightning wallet is successfully created 🎉',
                style: TenjinTypography.interMed22.copyWith(color: TenjinColors.black),
              ),
            ),
            SizedBox(height: getRelativeHeight(20)),
            Text(
              'Get ready to redeem your rBTC and experience the power of Lightning Network.',
              style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
            ),
            const Spacer(),
            TenjinButton(
              text: 'Continue the journey',
              onPressed: () => Get.to(() => const LearnPage()),
            ),
            SizedBox(height: getRelativeHeight(80)),
          ],
        ),
      ),
    );
  }
}
