import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/leaderboard_page/controllers/leaderboard_controller.dart';

import '../../../services/auth_service.dart';
import '../../learn_page/controllers/learn_controller.dart';
import '../../learn_page/learn_page.dart';

class LoginController extends GetxController {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  Future login() async {
    var authService = Get.find<AuthService>();
    var res = await authService.login(emailController.text, passwordController.text);
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
