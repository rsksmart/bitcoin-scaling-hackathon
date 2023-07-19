import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_textfield.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

import '../../theme/tenjin_colors/tenjin_colors.dart';
import '../../theme/tenjin_typography/tenjin_typography.dart';
import 'controllers/registration_controller.dart';

class RegistrationPage extends GetView<RegistrationController> {
  const RegistrationPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(RegistrationController());
    return TenjinScaffold(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              decoration: const BoxDecoration(
                color: TenjinColors.orange,
              ),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Text(
                  'Hey there!',
                  style: TenjinTypography.interBold40,
                ),
              ),
            ),
            const SizedBox(
              height: 10,
            ),
            Container(
              decoration: BoxDecoration(
                color: TenjinColors.green,
                borderRadius: BorderRadius.circular(100),
              ),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Text(
                  'Register now!',
                  style: TenjinTypography.interBold40,
                ),
              ),
            ),
            SizedBox(
              height: getRelativeHeight(89),
            ),
            TenjinTextfield(
              controller: controller.usernameController,
              hintText: 'User name',
            ),
            const SizedBox(
              height: 20,
            ),
            TenjinTextfield(
              controller: controller.emailController,
              hintText: 'Email',
            ),
            const SizedBox(
              height: 20,
            ),
            TenjinTextfield(
              controller: controller.passwordController,
              hintText: 'Enter your password',
              obscureInput: true,
            ),
            const SizedBox(
              height: 20,
            ),
            TenjinTextfield(
              controller: controller.confirmPasswordController,
              hintText: 'Confirm your password',
              obscureInput: true,
            ),
            const SizedBox(
              height: 40,
            ),
            TenjinButton(
              text: 'Register',
              onPressed: () async {
                await controller.register();
              },
            ),
            SizedBox(
              height: getRelativeHeight(15),
            ),
            Center(
              child: Image.asset(
                'assets/icons/rootstock_icon.png',
              ),
            ),
            const SizedBox(
              height: 35,
            ),
          ],
        ),
      ),
    );
  }
}
