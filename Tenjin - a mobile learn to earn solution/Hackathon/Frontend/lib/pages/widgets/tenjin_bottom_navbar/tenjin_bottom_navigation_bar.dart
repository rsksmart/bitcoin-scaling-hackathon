import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

import 'controller/nav_bar_controller.dart';

class TenjinBottomNavigationBar extends GetView<TenjinBottomNavigationBarController> {
  const TenjinBottomNavigationBar({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(TenjinBottomNavigationBarController());
    return Container(
      padding: const EdgeInsets.all(15.0),
      decoration: const BoxDecoration(
        color: TenjinColors.white20,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(15),
          topRight: Radius.circular(15),
        ),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          NavButton(
            text: 'Learn',
            index: 0,
          ),
          SizedBox(width: 20),
          NavButton(
            text: 'Leaderboard',
            index: 1,
          ),
          SizedBox(width: 20),
          NavButton(
            text: 'Settings',
            index: 2,
          ),
        ],
      ),
    );
  }
}

class NavButton extends GetView<TenjinBottomNavigationBarController> {
  const NavButton({
    super.key,
    required this.text,
    required this.index,
  });
  final String text;
  final int index;

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: GestureDetector(
      onTap: () => controller.onTap(index),
      child: Container(
        height: 40,
        decoration: const BoxDecoration(
          color: TenjinColors.white,
          borderRadius: BorderRadius.all(
            Radius.circular(15),
          ),
        ),
        child: Center(
          child: Obx(() {
            return Text(text,
                style: TenjinTypography.interMed14.copyWith(
                  color: controller.selectedIndex.value == index ? TenjinColors.orange : TenjinColors.black,
                ));
          }),
        ),
      ),
    ));
  }
}
