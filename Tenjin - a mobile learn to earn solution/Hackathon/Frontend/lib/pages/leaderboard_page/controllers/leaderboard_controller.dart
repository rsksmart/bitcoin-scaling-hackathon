import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/models/user_leaderboard_model.dart';
import 'package:tenjin_rootstock_all/services/leaderboard_service.dart';

class LeaderboardController extends GetxController {
  RxInt timespanIndex = 0.obs;

  RxList<UserLeaderboard> userLeaderboardList = <UserLeaderboard>[].obs;

  LeaderboardService leaderboardService = Get.put(LeaderboardService());

  fetchLeaderboard() async {
    if (timespanIndex.value == 0) {
      List<UserLeaderboard> dailyUserList = (await leaderboardService.getDailyLeaderboard())..sort(((a, b) => b.xp.compareTo(a.xp)));

      if (dailyUserList.length < 3) return;

      userLeaderboardList.value = dailyUserList;
    } else if (timespanIndex.value == 1) {
      List<UserLeaderboard> weeklyUserList = (await leaderboardService.getWeeklyLeaderboard())..sort(((a, b) => a.xp.compareTo(b.xp)));

      if (weeklyUserList.length < 3) return;

      userLeaderboardList.value = weeklyUserList;
    } else if (timespanIndex.value == 2) {
      List<UserLeaderboard> monthlyUserList = (await leaderboardService.getMonthlyLeaderboard())..sort(((a, b) => a.xp.compareTo(b.xp)));

      if (monthlyUserList.length < 3) return;

      userLeaderboardList.value = monthlyUserList;
    }
  }
}
