import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/services/wallet_service.dart';

class PasswordPromptController extends GetxService {
  final passwordController = TextEditingController();
  final formKey = GlobalKey<FormState>();

  String? validator(String? password) {
    if (password!.isEmpty) return 'Please enter your password';
    if (!Get.put(WalletService()).wallet!.verifyPassword(password)) return 'Incorrect password';
    return null;
  }

  confirmPassword() async {
    if (!formKey.currentState!.validate()) return; //todo make sure validator works

    Get.back(result: passwordController.text);
  }
}
