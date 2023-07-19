import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/leaderboard_page/widgets/board_widget.dart';
import 'package:tenjin_rootstock_all/pages/leaderboard_page/widgets/timespan_button.dart';
import 'package:tenjin_rootstock_all/pages/leaderboard_page/widgets/top_three_card.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/services/user_service.dart';

import '../../theme/tenjin_colors/tenjin_colors.dart';
import '../../theme/tenjin_typography/tenjin_typography.dart';
import '../../utils/utils.dart';
import 'controllers/leaderboard_controller.dart';

class LeaderboardPage extends GetView<LeaderboardController> {
  const LeaderboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(LeaderboardController());
    UserService userService = Get.put(UserService());

    return TenjinScaffold(
      canPop: false,
      enableBottomNavBar: true,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Obx(
                      () => Text(
                        '@${userService.userProfile.value!.username}',
                        style: TenjinTypography.interMed22.copyWith(
                          color: TenjinColors.white,
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 11,
                    ),
                    Row(
                      children: [
                        Container(
                          width: 23,
                          height: 23,
                          decoration: BoxDecoration(
                            color: TenjinColors.green,
                            borderRadius: BorderRadius.circular(100),
                          ),
                          child: Image.asset('assets/icons/xp_icon.png'),
                        ),
                        const SizedBox(
                          width: 5,
                        ),
                        Obx(
                          () => Text(
                            numberWithCommas(userService.userStatistics.value!.totalXp),
                            style: TenjinTypography.interMed14.copyWith(
                              color: TenjinColors.green,
                            ),
                          ),
                        ),
                        const SizedBox(
                          width: 23,
                        ),
                        Container(
                          width: 23,
                          height: 23,
                          decoration: BoxDecoration(
                            color: TenjinColors.orange,
                            borderRadius: BorderRadius.circular(100),
                          ),
                          child: Image.asset('assets/icons/bitcoin_icon.png'),
                        ),
                        const SizedBox(
                          width: 5,
                        ),
                        Obx(
                          () => Text(
                            numberWithCommas(userService.userStatistics.value!.rbtcBalance.toInt()),
                            style: TenjinTypography.interMed14.copyWith(
                              color: TenjinColors.orange,
                            ),
                          ),
                        ),
                      ],
                    )
                  ],
                ),
                const Spacer(),
                Obx(
                  () => CircleAvatar(
                    radius: 30,
                    foregroundImage: userService.userProfile.value!.avatar != null ? NetworkImage(userService.userProfile.value!.avatar!) : null,
                  ),
                ),
              ],
            ),
            const SizedBox(
              height: 35,
            ),
            Container(
              color: TenjinColors.green,
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Text(
                  'Leaderboard',
                  style: TenjinTypography.interMed22,
                ),
              ),
            ),
            const SizedBox(
              height: 35,
            ),
            const Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TimespanButton(index: 0, text: 'Today'),
                  SizedBox(
                    width: 13,
                  ),
                  TimespanButton(index: 1, text: 'Week'),
                  SizedBox(
                    width: 13,
                  ),
                  TimespanButton(index: 2, text: 'Month'),
                ],
              ),
            ),
            const SizedBox(
              height: 35,
            ),
            const TopThreeCard(),
            const SizedBox(
              height: 35,
            ),
            const BoardWidget()
          ],
        ),
      ),
    );
  }
}
