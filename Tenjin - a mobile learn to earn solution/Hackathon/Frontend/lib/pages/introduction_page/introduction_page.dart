import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/register_page/registration_page.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class IntroductionPage extends StatelessWidget {
  const IntroductionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return TenjinScaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: getRelativeHeight(150),
          ),
          Container(
            decoration: const BoxDecoration(
              color: TenjinColors.orange,
            ),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Text(
                'Discover',
                style: TenjinTypography.interBold40,
              ),
            ),
          ),
          const SizedBox(
            height: 10,
          ),
          Container(
            decoration: BoxDecoration(
              color: TenjinColors.white,
              borderRadius: BorderRadius.circular(100),
            ),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Text(
                ' the world of',
                style: TenjinTypography.interBold40,
              ),
            ),
          ),
          const SizedBox(
            height: 10,
          ),
          Container(
            decoration: const BoxDecoration(
              color: TenjinColors.white,
            ),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Text(
                'BTC & Rootstock',
                style: TenjinTypography.interBold40,
              ),
            ),
          ),
          const SizedBox(
            height: 10,
          ),
          Container(
            decoration: const BoxDecoration(
              color: TenjinColors.green,
            ),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Text(
                'with ease!',
                style: TenjinTypography.interBold40,
              ),
            ),
          ),
          const Spacer(),
          TenjinButton(
            text: 'Get Started',
            onPressed: () => Get.to(
              () => const RegistrationPage(),
              duration: Duration.zero,
            ),
            color: TenjinColors.orange,
            expanded: false,
          ),
          SizedBox(
            height: getRelativeHeight(39),
          ),
          Center(
            child: Image.asset(
              'assets/icons/rootstock_icon.png',
            ),
          ),
          SizedBox(
            height: getRelativeHeight(38),
          ),
        ],
      ),
    );
  }
}