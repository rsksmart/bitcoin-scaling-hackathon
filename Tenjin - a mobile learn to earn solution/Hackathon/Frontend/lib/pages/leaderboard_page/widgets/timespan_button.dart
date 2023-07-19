import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../theme/tenjin_colors/tenjin_colors.dart';
import '../../../theme/tenjin_typography/tenjin_typography.dart';
import '../controllers/leaderboard_controller.dart';

class TimespanButton extends GetView<LeaderboardController> {
  const TimespanButton({super.key, required this.index, required this.text});
  final int index;
  final String text;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        controller.timespanIndex.value = index;
        await controller.fetchLeaderboard();
      },
      child: Obx(() {
        return Container(
          decoration: BoxDecoration(
            color: (index == controller.timespanIndex.value) ? TenjinColors.orange : TenjinColors.white20,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              text,
              style: TenjinTypography.interMed14,
            ),
          ),
        );
      }),
    );
  }
}
