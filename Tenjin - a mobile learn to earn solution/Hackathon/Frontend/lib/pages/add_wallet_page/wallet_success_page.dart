import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/learn_page.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

import '../widgets/tenjin_button.dart';

class WalletSuccessPage extends StatelessWidget {
  const WalletSuccessPage({super.key});

  @override
  Widget build(BuildContext context) {
    return TenjinScaffold(
      enableBottomNavBar: true,
      body: Center(
        child: Column(
          children: [
            SizedBox(
              height: getRelativeHeight(181),
            ),
            Container(
              width: double.infinity,
              color: TenjinColors.orange,
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Center(
                  child: Text(
                    'Congratulations!\n Your lightning wallet is\n successfully created 🎉',
                    textAlign: TextAlign.center,
                    style: TenjinTypography.interMed22,
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            Text(
              'Get ready to redeem your rBTC and experience the power of Lightning Network.',
              textAlign: TextAlign.center,
              style: TenjinTypography.interMed14.copyWith(
                color: TenjinColors.white,
              ),
            ),
            const Spacer(),
            TenjinButton(
              text: 'Continue the journey',
              onPressed: () => Get.offAll(() => const LearnPage()),
            ),
            const SizedBox(height: 30)
          ],
        ),
      ),
    );
  }
}
