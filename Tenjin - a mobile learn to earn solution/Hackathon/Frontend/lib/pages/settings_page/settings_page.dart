import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/send_page/send_page.dart';
import 'package:tenjin_rootstock_all/pages/settings_page/widgets/settings_buttons.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/services/auth_service.dart';
import 'package:tenjin_rootstock_all/services/wallet_service.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return TenjinScaffold(
      canPop: false,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        centerTitle: true,
        //make appbar transparent
        backgroundColor: Colors.transparent,
        foregroundColor: TenjinColors.white,
        title: Text(
          'Settings',
          style: TenjinTypography.interMed22.copyWith(
            color: TenjinColors.white,
          ),
        ),
      ),
      enableBottomNavBar: true,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (Get.put(WalletService()).wallet != null) ...[
            const SizedBox(
              height: 25,
            ),
            SettingsButton(
              text: 'Send token',
              onPressed: () => Get.to(() => const SendPage()),
            ),
          ],
          const SizedBox(
            height: 25,
          ),
          SettingsButton(
            text: 'Account settings',
            onPressed: () {},
          ),
          const SizedBox(
            height: 20,
          ),
          SettingsButton(
            text: 'Change password',
            onPressed: () {},
          ),
          const SizedBox(
            height: 20,
          ),
          SettingsButton(
            text: 'Privacy settings',
            onPressed: () {},
          ),
          const SizedBox(
            height: 20,
          ),
          SettingsButton(
            text: 'Terms of service',
            onPressed: () {},
          ),
          const SizedBox(
            height: 20,
          ),
          SettingsButton(
            text: 'Log out',
            onPressed: () async => Get.put(AuthService()).logout(),
          ),
          const SizedBox(
            height: 20,
          ),
        ],
      ),
    );
  }
}
