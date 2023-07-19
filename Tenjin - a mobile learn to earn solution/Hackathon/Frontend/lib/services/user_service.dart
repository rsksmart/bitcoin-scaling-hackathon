
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/models/user.dart';
import 'package:tenjin_rootstock_all/services/auth_service.dart';

import '../models/user_profile_model.dart';
import '../models/userstatistic_model.dart';

class UserService extends GetxService {
  Rxn<UserStatistics> userStatistics = Rxn<UserStatistics>();
  Rxn<User> user = Rxn<User>();
  Rxn<UserProfile> userProfile = Rxn<UserProfile>();

  clear() {
    userStatistics.value = UserStatistics(id: -1, currentCategory: -1, level: -1, levelPercentage: -1, rbtc: BigInt.zero, totalXp: -1, user: -1);
    user.value = User(id: -1, email: '');
    userProfile.value = UserProfile(id: -1, username: '');
  }

  updateWalletAddress(String address) async {
    await Get.put(AuthService()).init();
  }
}
