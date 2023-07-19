import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/send_page/send_page.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class FailSendPage extends StatelessWidget {
  const FailSendPage({super.key});

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
              color: TenjinColors.pink,
              padding: const EdgeInsets.all(10),
              child: Text(
                'Unsuccessful!',
                style: TenjinTypography.interBold40.copyWith(color: TenjinColors.black),
              ),
            ),
            SizedBox(height: getRelativeHeight(20)),
            Text(
              'We\'re sorry to inform you that there was an issue with the token transfer. Please double-check the recipient\'s information and try again. If the problem persists, please reach out to our support team for further assistance.',
              style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
            ),
            const Spacer(),
            TenjinButton(
              text: 'Done',
              onPressed: () => Get.offAll(() => const SendPage()),
            ),
            SizedBox(height: getRelativeHeight(80)),
          ],
        ),
      ),
    );
  }
}
