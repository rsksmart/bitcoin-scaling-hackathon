import 'dart:developer';

import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/models/wallet.dart';
import 'package:tenjin_rootstock_all/pages/add_wallet_page/success_wallet_creation.dart';
import 'package:tenjin_rootstock_all/services/auth_service.dart';
import 'package:tenjin_rootstock_all/services/wallet_service.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';
import 'package:tenjin_rootstock_all/utils/wallet_functions.dart';

class AddWalletController extends GetxController {
  @override
  void onInit() {
    seedPhrase = WalletUtils.generateSeedPhrase();
    log(seedPhrase.toString());
    randomSeedPhrase.value = List.of(seedPhrase)..shuffle();
    super.onInit();
  }

  late List<String> seedPhrase;
  RxList<String> randomSeedPhrase = RxList([]);
  RxList<String> enteredSeedPhrase = RxList([]);
  RxString errorMsg = RxString('');

  checkSeedPhrase() async {
    errorMsg.value = '';
    if (!listEquals(seedPhrase, enteredSeedPhrase)) {
      errorMsg.value = 'Secret words are not ordered correctly';
      await Future.delayed(const Duration(seconds: 3), () => errorMsg.value = '');
      return;
    }

    String password = ''; //todo get password from user // = await passwordPrompt();

    loading();
    Wallet wallet = await WalletUtils.createWallet(password, seedPhrase);
    await Get.put(WalletService()).saveWallet(wallet);

    await Get.put(AuthService()).updateWalletAddress(wallet.address);

    Get.off(() => const SuccessWalletCreation());
  }
}
