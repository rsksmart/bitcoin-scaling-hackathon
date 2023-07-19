import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_border.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_button.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/services/user_service.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

import 'controller/send_controller.dart';

class ConfirmSendPage extends GetView<SendController> {
  const ConfirmSendPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(SendController());
    final userService = Get.put(UserService());
    return TenjinScaffold(
      appBar: AppBar(
        centerTitle: true,
        backgroundColor: Colors.transparent,
        foregroundColor: TenjinColors.white,
        title: Text(
          'Confirm',
          style: TenjinTypography.interMed22.copyWith(
            color: TenjinColors.white,
          ),
        ),
      ),
      body: Column(
        children: [
          SizedBox(height: getRelativeHeight(20)),
          Container(
            padding: const EdgeInsets.all(10),
            color: TenjinColors.green,
            child: Text(
              '${controller.amountController.text} rBTC',
              style: TenjinTypography.interBold40.copyWith(color: TenjinColors.black),
            ),
          ),
          SizedBox(height: getRelativeHeight(35)),
          TenjinBorder(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: TenjinColors.pink,
                    borderRadius: BorderRadius.circular(22),
                  ),
                  child: Text(
                    'From',
                    style: TenjinTypography.interMed14.copyWith(color: TenjinColors.black),
                  ),
                ),
                SizedBox(height: getRelativeHeight(20)),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 12,
                      backgroundColor: TenjinColors.orange,
                      foregroundImage: userService.userProfile.value!.avatar != null ? NetworkImage(userService.userProfile.value!.avatar!) : null,
                    ),
                    SizedBox(width: getRelativeWidth(5)),
                    Text(
                      shortenAddress(controller.address),
                      style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: getRelativeHeight(20)),
          TenjinBorder(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: TenjinColors.orange,
                    borderRadius: BorderRadius.circular(22),
                  ),
                  child: Text(
                    'To',
                    style: TenjinTypography.interMed14.copyWith(color: TenjinColors.black),
                  ),
                ),
                SizedBox(height: getRelativeHeight(20)),
                Row(
                  children: [
                    const CircleAvatar(
                      radius: 12,
                      backgroundColor: TenjinColors.orange,
                      // foregroundImage: NetworkImage(''), //todo get recipient user image
                    ),
                    SizedBox(width: getRelativeWidth(5)),
                    Text(
                      shortenAddress(controller.addressController.text),
                      style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: getRelativeHeight(35)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Fees',
                style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
              ),
              Text(
                '-${controller.feesEth} rBTC',
                style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
              ),
            ],
          ),
          SizedBox(height: getRelativeHeight(10)),
          Row(
            children: [
              const Icon(
                Icons.info_outline,
                size: 24,
                color: TenjinColors.orange,
              ),
              SizedBox(width: getRelativeWidth(8)),
              Text(
                'Please double check the information',
                style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
              ),
            ],
          ),
          const Spacer(),
          TenjinButton(
            text: 'Confirm',
            onPressed: () => controller.send(),
          ),
          SizedBox(height: getRelativeHeight(80)),
        ],
      ),
    );
  }
}
