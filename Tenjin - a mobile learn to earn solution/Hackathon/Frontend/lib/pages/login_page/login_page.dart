import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_textfield.dart';

import '../../theme/tenjin_colors/tenjin_colors.dart';
import '../../theme/tenjin_typography/tenjin_typography.dart';
import '../../utils/utils.dart';
import '../register_page/registration_page.dart';
import 'controller/login_controller.dart';

class LoginPage extends GetView<LoginController> {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(LoginController());
    return TenjinScaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            decoration: const BoxDecoration(
              color: TenjinColors.green,
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
              color: TenjinColors.white,
              borderRadius: BorderRadius.circular(100),
            ),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Text(
                'Login now!',
                style: TenjinTypography.interBold40,
              ),
            ),
          ),
          SizedBox(
            height: getRelativeHeight(99),
          ),
          TenjinTextfield(controller: controller.emailController, hintText: 'Enter your email'),
          const SizedBox(
            height: 20,
          ),
          TenjinTextfield(controller: controller.passwordController, hintText: 'Enter your password', obscureInput: true,),
          const SizedBox(
            height: 10,
          ),
          Row(
            children: [
              const Spacer(),
              GestureDetector(
                onTap: () {
                  print('forgot password, sad');
                },
                child: Text(
                  'Forgot Password?',
                  style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white20),
                ),
              )
            ],
          ),
          const SizedBox(
            height: 40,
          ),
          TenjinButton(
            text: 'Login',
            onPressed: () async {
              await controller.login();
            },
          ),
          const Spacer(),
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "Don't have an account? ",
                  style: TenjinTypography.interMed14.copyWith(
                    color: TenjinColors.white20,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    Get.to(
                      () => const RegistrationPage(),
                      duration: const Duration(milliseconds: 0),
                    );
                  },
                  child: Text(
                    "Register now",
                    style: TenjinTypography.interMed14.copyWith(
                      color: TenjinColors.green,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 39,
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
    );
  }
}
