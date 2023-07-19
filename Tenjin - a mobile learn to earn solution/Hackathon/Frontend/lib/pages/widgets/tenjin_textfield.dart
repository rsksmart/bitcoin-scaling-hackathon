import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

class TenjinTextfield extends StatelessWidget {
  const TenjinTextfield({
    super.key,
    required this.controller,
    this.hintText,
    this.obscureInput = false,
    this.validator,
  });
  final TextEditingController controller;
  final String? hintText;
  final bool obscureInput;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    RxBool obscureText = true.obs;
    obscureText.value = obscureInput;
    return Obx(() {
      return TextFormField(
        validator: validator,
        style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
        controller: controller,
        obscureText: obscureText.value,
        decoration: InputDecoration(
          suffixIcon: (obscureInput)
              ? GestureDetector(
                  onTap: () {
                    obscureText.value = !obscureText.value;
                  },
                  child: Icon(
                    Icons.remove_red_eye_sharp,
                    color: (obscureText.value) ? TenjinColors.white20 : TenjinColors.white,
                  ),
                )
              : null,
          hintText: hintText,
          hintStyle: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
          enabledBorder: OutlineInputBorder(
            borderSide: const BorderSide(width: 1, color: TenjinColors.white),
            borderRadius: BorderRadius.circular(15),
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
      );
    });
  }
}
