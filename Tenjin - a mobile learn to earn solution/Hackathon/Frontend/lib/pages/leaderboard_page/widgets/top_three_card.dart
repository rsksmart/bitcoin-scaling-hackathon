import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

import '../controllers/leaderboard_controller.dart';

class TopThreeCard extends GetView<LeaderboardController> {
  const TopThreeCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      //rounded borders
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        //border color
        border: Border.all(
          color: TenjinColors.white,
          width: 1,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Obx(
            () => (controller.userLeaderboardList.length < 2)
                ? const SizedBox()
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(
                        height: 31,
                      ),
                      Text(
                        '2',
                        style: TenjinTypography.interMed22.copyWith(color: TenjinColors.orange),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      CircleAvatar(
                        backgroundColor: TenjinColors.orange,
                        radius: 30.5,
                        child: Obx(
                          () => CircleAvatar(
                            radius: 28.5,
                            foregroundImage: controller.userLeaderboardList[1].avatar != null ? NetworkImage(controller.userLeaderboardList[1].avatar!) : null,
                          ),
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      SizedBox(
                        width: getRelativeWidth(100),
                        child: Obx(
                          () => AutoSizeText(
                            '@${controller.userLeaderboardList[1].user}',
                            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.green),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      SizedBox(
                        width: getRelativeWidth(100),
                        child: Obx(
                          () => AutoSizeText(
                            '${controller.userLeaderboardList[1].xp} XP',
                            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.orange),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
          Obx(
            () => (controller.userLeaderboardList.isEmpty)
                ? const SizedBox()
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Image.asset('assets/images/crown.png'),
                      const SizedBox(
                        height: 5,
                      ),
                      CircleAvatar(
                        backgroundColor: TenjinColors.orange,
                        radius: 30.5,
                        child: Obx(
                          () => CircleAvatar(
                            radius: 28.5,
                            foregroundImage: controller.userLeaderboardList[0].avatar != null ? NetworkImage(controller.userLeaderboardList[0].avatar!) : null,
                          ),
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      SizedBox(
                        width: getRelativeWidth(100),
                        child: Obx(
                          () => AutoSizeText(
                            '@${controller.userLeaderboardList[0].user}',
                            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.green),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      SizedBox(
                        width: getRelativeWidth(100),
                        child: Obx(
                          () => AutoSizeText(
                            '${controller.userLeaderboardList[0].xp} XP',
                            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.orange),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                      const SizedBox(
                        height: 31,
                      ),
                    ],
                  ),
          ),
          Obx(
            () => (controller.userLeaderboardList.length < 3)
                ? const SizedBox()
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(
                        height: 31,
                      ),
                      Text(
                        '3',
                        style: TenjinTypography.interMed22.copyWith(color: TenjinColors.orange),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      CircleAvatar(
                        backgroundColor: TenjinColors.orange,
                        radius: 30.5,
                        child: Obx(
                          () => CircleAvatar(
                            radius: 28.5,
                            foregroundImage: controller.userLeaderboardList[2].avatar != null ? NetworkImage(controller.userLeaderboardList[2].avatar!) : null,
                          ),
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      SizedBox(
                        width: getRelativeWidth(100),
                        child: Obx(
                          () => AutoSizeText(
                            '@${controller.userLeaderboardList[2].user}',
                            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.green),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      SizedBox(
                        width: getRelativeWidth(100),
                        child: Obx(
                          () => AutoSizeText(
                            '${controller.userLeaderboardList[2].xp} XP',
                            style: TenjinTypography.interMed22.copyWith(color: TenjinColors.orange),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ],
                  ),
          )
        ],
      ),
    );
  }
}
