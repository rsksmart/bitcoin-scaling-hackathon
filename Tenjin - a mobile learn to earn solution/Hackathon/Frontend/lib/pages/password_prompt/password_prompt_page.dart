import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/password_prompt/controller/password_prompt_controller.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_textfield.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class PasswordPromptPage extends GetView<PasswordPromptController> {
  const PasswordPromptPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(PasswordPromptController());
    return TenjinScaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        foregroundColor: TenjinColors.white,
      ),
      body: Column(
        children: [
          const Spacer(),
          Container(
            color: TenjinColors.orange,
            padding: const EdgeInsets.all(10),
            child: Text(
              'Confirm',
              style: TenjinTypography.interBold40.copyWith(color: TenjinColors.black),
            ),
          ),
          SizedBox(height: getRelativeHeight(20)),
          Text(
            'For enhanced security, please enter your password to continue with the money transfer.',
            style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
          ),
          SizedBox(height: getRelativeHeight(70)),
          Form(
            key: controller.formKey,
            child: TenjinTextfield(
              validator: controller.validator,
              controller: controller.passwordController,
              hintText: 'Enter your password',
              obscureInput: true,
            ),
          ),
          const Spacer(),
          TenjinButton(
            text: 'Confirm',
            onPressed: () => controller.confirmPassword(),
          ),
          SizedBox(height: getRelativeHeight(80)),
        ],
      ),
    );
  }
}
