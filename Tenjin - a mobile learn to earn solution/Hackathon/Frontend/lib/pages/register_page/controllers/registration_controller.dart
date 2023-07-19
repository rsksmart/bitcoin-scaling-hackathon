import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/leaderboard_page/controllers/leaderboard_controller.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/learn_page.dart';

import '../../../services/auth_service.dart';
import '../../learn_page/controllers/learn_controller.dart';

class RegistrationController extends GetxController {
  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  register() async {
    var authService = Get.find<AuthService>();
    var res = await authService.registration(emailController.text, passwordController.text, usernameController.text);
    print(res);
    if (res == "") {
      await Get.put(LearnController()).fetchLessonList();
      await Get.put(LeaderboardController()).fetchLeaderboard();
      Get.offAll(
        () => const LearnPage(),
        duration: const Duration(milliseconds: 0),
      );
    }
  }
}
