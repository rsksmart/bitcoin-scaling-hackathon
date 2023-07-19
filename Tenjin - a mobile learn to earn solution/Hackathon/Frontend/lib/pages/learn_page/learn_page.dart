import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/add_wallet_page.dart';
import 'package:tenjin_rootstock_all/pages/learn_page/widgets/chapter_card.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/services/user_service.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

import '../../services/auth_service.dart';
import '../../utils/utils.dart';
import 'controllers/learn_controller.dart';

class LearnPage extends GetView<LearnController> {
  const LearnPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(LearnController());
    UserService userService = Get.find<UserService>();

    return TenjinScaffold(
      canPop: false,
      enableBottomNavBar: true,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: MediaQuery.of(context).padding.top,
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hi, ${userService.userProfile.value!.username}',
                      style: TenjinTypography.interMed22.copyWith(
                        color: TenjinColors.white,
                      ),
                    ),
                    const SizedBox(
                      height: 5,
                    ),
                    Text(
                      "Let’s start learning",
                      style: TenjinTypography.interMed14.copyWith(
                        color: TenjinColors.white,
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
                        GestureDetector(
                          onTap: () async {
                            //if (Get.put(WalletService()).wallet == null) return;

                            await Get.defaultDialog(
                              title: "Redeeming\nrBTC",
                              backgroundColor: TenjinColors.white,
                              content: Column(
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text("Claim your rewards", style: TenjinTypography.interMed14),
                                      Text("This might take a while", style: TenjinTypography.interMed14),
                                      // Text(" • Use a lightning wallet", style: TenjinTypography.interMed14),
                                      // Text(" • Create an invoice for the amount you want to redeem (if the amount is more than your balance, it will not work)", style: TenjinTypography.interMed14),
                                      // Text(" • Enter your invoice below & redeem!", style: TenjinTypography.interMed14)
                                    ],
                                  ),
                                  SizedBox(
                                    height: getRelativeHeight(20),
                                  ),
                                  // Obx(
                                  //   () => TextField(
                                  //     controller: controller.invoiceController.value,
                                  //     decoration: InputDecoration(hintText: "Enter lightning invoice", hintStyle: TenjinTypography.interMed14, focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: const BorderSide(color: TenjinColors.orange)), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: const BorderSide(color: TenjinColors.orange))),
                                  //   ),
                                  // ),
                                  SizedBox(
                                    height: getRelativeHeight(20),
                                  ),
                                  ElevatedButton(
                                    onPressed: () async {
                                      try {
                                        //loading dialog
                                        Get.back();
                                        Get.dialog(
                                          const Center(
                                            child: CircularProgressIndicator(
                                              color: TenjinColors.orange,
                                            ),
                                          ),
                                        );

                                        await Get.put(AuthService()).redeem(Get.put(UserService()).userStatistics.value!.rbtc.toInt());
                                        Get.back();
                                      } catch (e) {
                                        Get.back();
                                      }
                                    },
                                    style: ElevatedButton.styleFrom(
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(100),
                                      ),
                                      backgroundColor: TenjinColors.orange,
                                      foregroundColor: TenjinColors.orange,
                                    ),
                                    child: Text('Redeem', style: TenjinTypography.interMed14),
                                  ),
                                ],
                              ),
                            );
                          },
                          child: Row(
                            children: [
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
            Row(
              children: [
                const Icon(
                  Icons.account_balance_wallet_outlined,
                  color: TenjinColors.white20,
                  size: 28,
                ),
                const SizedBox(
                  width: 10,
                ),
                (!controller.walletConnected)
                    ? Row(
                        children: [
                          Text(
                            'Create wallet ',
                            style: TenjinTypography.interMed22.copyWith(
                              color: TenjinColors.white,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => Get.to(() => const AddWalletPage()),
                            child: Text(
                              'NOW',
                              style: TenjinTypography.interMed22.copyWith(
                                color: TenjinColors.orange,
                              ),
                            ),
                          ),
                        ],
                      )
                    : Text(
                        'Connected Wallet',
                        style: TenjinTypography.interMed22.copyWith(
                          color: TenjinColors.white,
                        ),
                      ),
              ],
            ),
            if (controller.walletConnected)
              Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 5, right: 5),
                    child: Text(
                      shortenAddress(controller.walletAddress),
                      style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white20),
                    ),
                  ),
                  GestureDetector(
                    child: Image.asset('assets/icons/copy_icon.png'),
                    onTap: () async {
                      await Clipboard.setData(ClipboardData(text: controller.walletAddress));
                      Get.snackbar(
                        "Wallet address copied",
                        controller.walletAddress,
                        colorText: TenjinColors.white,
                      );
                    },
                  ),
                ],
              ),
            SizedBox(height: (controller.walletConnected) ? 35 : 58),
            Obx(
              () => Column(
                children: List.generate(
                  controller.lessonList.length,
                  (index) => Padding(
                    padding: EdgeInsets.symmetric(vertical: getRelativeHeight(10)),
                    child: ChapterCard(
                      chapter: controller.lessonList[index],
                      chapterNumber: controller.lessonList[index].sequence,
                      chapterTitle: controller.lessonList[index].title,
                      progress: controller.lessonList[index].classList.where((e) => e.completed).toList().length,
                      totalParts: controller.lessonList[index].classList.length,
                      chapterDescription: controller.lessonList[index].description,
                      chapterNumberColor: controller.lessonList[index].sequence % 2 != 0 ? TenjinColors.pink : TenjinColors.white,
                      chapterTitleColor: controller.lessonList[index].sequence % 2 != 0 ? TenjinColors.green : TenjinColors.orange,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
