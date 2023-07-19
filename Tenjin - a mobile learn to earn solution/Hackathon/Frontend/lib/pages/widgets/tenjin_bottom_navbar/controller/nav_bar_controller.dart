import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/leaderboard_page/leaderboard_page.dart';
import 'package:tenjin_rootstock_all/pages/settings_page/settings_page.dart';

import '../../../learn_page/controllers/learn_controller.dart';
import '../../../learn_page/learn_page.dart';

class TenjinBottomNavigationBarController extends GetxController {
  RxInt selectedIndex = 0.obs;

  onTap(int index) async {
    if (index != selectedIndex.value) {
      selectedIndex.value = index;
      if (index == 0) {
        await Get.put(LearnController()).fetchLessonList();
        Get.to(
          () => const LearnPage(),
          duration: const Duration(milliseconds: 0),
        );
      } else if (index == 1) {
        Get.to(
          () => const LeaderboardPage(),
          duration: const Duration(milliseconds: 0),
        );
      } else if (index == 2) {
        Get.to(
          () => const SettingsPage(),
          duration: const Duration(milliseconds: 0),
        );
      }
    }
  }
}
