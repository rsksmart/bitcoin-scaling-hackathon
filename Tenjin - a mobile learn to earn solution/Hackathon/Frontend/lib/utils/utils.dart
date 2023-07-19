import 'dart:math';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/password_prompt/password_prompt_page.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_loading.dart';

BigInt etherToWei(double ether) {
  return BigInt.from(ether * pow(10, 18));
}

double getRelativeWidth(double width) {
  var screenSize = MediaQuery.of(Get.context!).size;
  return screenSize.width * (width / 375);
}

double getRelativeHeight(double height) {
  var screenSize = MediaQuery.of(Get.context!).size;
  return screenSize.height * (height / 812);
}

//function to turn a number into a string with commas
String numberWithCommas(int x) {
  return x.toString().replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (Match m) => '${m[1]},',
      );
}

String shortenAddress(String address) {
  try {
    return '${address.substring(0, 6)}...${address.substring(address.length - 4)}';
  } catch (e) {
    return '';
  }
}

Future<String?> passwordPrompt() async => await Get.to(() => const PasswordPromptPage());

Future loading() async => await showDialog(
      barrierDismissible: false,
      context: Get.context!,
      builder: (context) => const TenjinLoading(),
    );
