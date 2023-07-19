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

class SendPage extends GetView<SendController> {
  const SendPage({super.key});

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
          'Send to',
          style: TenjinTypography.interMed22.copyWith(
            color: TenjinColors.white,
          ),
        ),
      ),
      body: Form(
        key: controller.formKey,
        child: Column(
          children: [
            SizedBox(height: getRelativeHeight(20)),
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
              child: TextFormField(
                validator: controller.addressValidator,
                controller: controller.addressController,
                style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'Recipient',
                  hintStyle: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                  suffixIconColor: TenjinColors.orange,
                  suffixIconConstraints: BoxConstraints.expand(width: getRelativeWidth(24), height: getRelativeHeight(24)),
                  suffixIcon: GestureDetector(
                    onTap: () => controller.scanAddress(),
                    child: const Icon(Icons.qr_code_scanner_rounded),
                  ),
                ),
              ),
            ),
            SizedBox(height: getRelativeHeight(20)),
            TenjinBorder(
              child: TextFormField(
                validator: controller.amountValidator,
                controller: controller.amountController,
                style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'Amount',
                  hintStyle: TenjinTypography.interMed14.copyWith(color: TenjinColors.white),
                  suffixIconConstraints: BoxConstraints.expand(
                    width: getRelativeWidth(38),
                    height: getRelativeHeight(18),
                  ),
                  suffixIcon: Text(
                    'RBTC',
                    style: TenjinTypography.interMed14.copyWith(color: TenjinColors.white20),
                  ),
                ),
              ),
            ),
            const Spacer(),
            TenjinButton(
              text: 'Send',
              onPressed: () => controller.confirmSend(),
            ),
            SizedBox(height: getRelativeHeight(80)),
          ],
        ),
      ),
    );
  }
}
