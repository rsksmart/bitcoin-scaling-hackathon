import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/services/auth_service.dart';
import 'package:tenjin_rootstock_all/services/chain_service.dart';
import 'package:tenjin_rootstock_all/services/secure_storage_service.dart';
import 'package:tenjin_rootstock_all/services/wallet_service.dart';

import '../../leaderboard_page/controllers/leaderboard_controller.dart';
import '../../learn_page/controllers/learn_controller.dart';

class SplashController extends GetxController {
  Future<bool> loadServices() async {
    await Get.put(SecureStorageService()).init();
    await Get.put(WalletService()).init();
    AuthService authService = Get.put(AuthService());
    await authService.init();
    Get.put(ChainService());
    if (authService.isLogged.value) {
      await Get.put(LearnController()).fetchLessonList();
      await Get.put(LeaderboardController()).fetchLeaderboard();
    }
    return true;
  }
}
