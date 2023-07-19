import 'dart:convert';
import 'dart:io';

import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/models/user_leaderboard_model.dart';
import 'package:tenjin_rootstock_all/services/auth_service.dart';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class LeaderboardService extends GetxService {
  AuthService authService = Get.find<AuthService>();

  Future<List<UserLeaderboard>> getDailyLeaderboard() async {
    print("GetDailyLeaderboard - starting getting users from daily leaderboard");
    var url = Uri.parse('${Constants.domain}/api/users/status/leaderboard/day/');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
      },
    );
    print("GetDailyLeaderboard - got response");

    if (response.statusCode == 200) {
      List jsonMap = jsonDecode(response.body);
      return List.generate(jsonMap.length, (index) => UserLeaderboard.fromJson(jsonMap[index]));
    } else {
      throw ("GetDailyLeaderboard - error while getting users from daily leaderboard with status code ${response.statusCode}");
    }
  }

  Future<List<UserLeaderboard>> getWeeklyLeaderboard() async {
    print("GetWeeklyLeaderboard - starting getting users from weekly leaderboard");
    var url = Uri.parse('${Constants.domain}/api/users/status/leaderboard/week/');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
      },
    );
    print("GetWeeklyLeaderboard - got response");

    if (response.statusCode == 200) {
      List jsonMap = jsonDecode(response.body);
      return List.generate(jsonMap.length, (index) => UserLeaderboard.fromJson(jsonMap[index]));
    } else {
      throw ("GetWeeklyLeaderboard - error while getting users from weekly leaderboard with status code ${response.statusCode}");
    }
  }

  Future<List<UserLeaderboard>> getMonthlyLeaderboard() async {
    print("GetMonthlyLeaderboard - starting getting users from monthly leaderboard");
    var url = Uri.parse('${Constants.domain}/api/users/status/leaderboard/month/');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
      },
    );
    print("GetMonthlyLeaderboard - got response");

    if (response.statusCode == 200) {
      List jsonMap = jsonDecode(response.body);
      return List.generate(jsonMap.length, (index) => UserLeaderboard.fromJson(jsonMap[index]));
    } else {
      throw ("GetMonthlyLeaderboard - error while getting users from monthly leaderboard with status code ${response.statusCode}");
    }
  }
}
