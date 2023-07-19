import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/learn_page.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class SuccessSendPage extends StatelessWidget {
  const SuccessSendPage({super.key});

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
              color: TenjinColors.green,
              padding: const EdgeInsets.all(10),
              child: Text(
                'Congrats!',
                style: TenjinTypography.interBold40.copyWith(color: TenjinColors.black),
              ),
            ),
            SizedBox(height: getRelativeHeight(20)),
            Text(
              'Your token has been successfully sent. It\'s on its way to the recipient. Thank you for using our app for your transactions.',
              style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
            ),
            const Spacer(),
            TenjinButton(
              text: 'Done',
              onPressed: () => Get.offAll(() => const LearnPage()),
            ),
            SizedBox(height: getRelativeHeight(80)),
          ],
        ),
      ),
    );
  }
}
