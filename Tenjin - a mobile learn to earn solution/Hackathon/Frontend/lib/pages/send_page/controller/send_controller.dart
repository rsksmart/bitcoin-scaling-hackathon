import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/send_page/confirm_send_page.dart';
import 'package:tenjin_rootstock_all/pages/send_page/fail_send_page.dart';
import 'package:tenjin_rootstock_all/pages/send_page/qr_scanner_page.dart';
import 'package:tenjin_rootstock_all/pages/send_page/success_send_page.dart';
import 'package:tenjin_rootstock_all/services/chain_service.dart';
import 'package:tenjin_rootstock_all/services/wallet_service.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';
import 'package:web3dart/web3dart.dart' as web3;

class SendController extends GetxController {
  final addressController = TextEditingController();
  final amountController = TextEditingController();
  final walletService = Get.put(WalletService());
  final client = Get.find<ChainService>().testnetClient;
  final chainId = Get.find<ChainService>().testnetChainId;

  final formKey = GlobalKey<FormState>();

  String get address => walletService.wallet!.address;

  RxDouble balanceEth = 0.0.obs;
  double feesEth = 0;

  String? addressValidator(String? address) {
    if (address!.isEmpty) return 'Address cannot be empty';
    try {
      web3.EthereumAddress.fromHex(address.toLowerCase());
    } catch (e) {
      return 'Invalid address';
    }
    return null;
  }

  String? amountValidator(String? amount) {
    if (amount!.isEmpty) return 'Amount cannot be empty';
    if ((double.tryParse(amount) ?? 0) == 0) return 'Invalid amount';
    if (double.parse(amount) > balanceEth.value) return 'Insufficient balance';
    return null;
  }

  confirmSend() async {
    if (!formKey.currentState!.validate()) return;

    BigInt gas = await client.estimateGas(
      sender: web3.EthereumAddress.fromHex(address.toLowerCase()),
      to: web3.EthereumAddress.fromHex(addressController.text.toLowerCase()),
      value: web3.EtherAmount.inWei(etherToWei(double.parse(amountController.text))),
    );

    web3.EtherAmount gasPrice = await client.getGasPrice();
    web3.EtherAmount feesWei = web3.EtherAmount.fromBigInt(web3.EtherUnit.wei, gasPrice.getInWei * gas);

    feesEth = feesWei.getValueInUnit(web3.EtherUnit.ether);

    Get.to(() => const ConfirmSendPage());
  }

  @override
  void onInit() async {
    balanceEth.value = await client.getBalance(web3.EthereumAddress.fromHex(address.toLowerCase())).then((value) => value.getValueInUnit(web3.EtherUnit.ether));
    super.onInit();
  }

  scanAddress() async {
    addressController.text = (await Get.to(() => QrScannerPage())) ?? '';
  }

  send() async {
    //NOTE: there is no real password used for now.
    var password = ''; //todo get password from user // = await passwordPrompt();

    loading();

    try {
      String privateKey = walletService.wallet!.getPrivateKey(password);
      var credentials = web3.EthPrivateKey.fromHex(privateKey);

      String txHash = await client.sendTransaction(
        credentials,
        web3.Transaction(
          to: web3.EthereumAddress.fromHex(addressController.text.toLowerCase()),
          value: web3.EtherAmount.inWei(
            etherToWei(double.parse(amountController.text)),
          ),
        ),
        chainId: chainId,
      );

      log(txHash);
      Get.off(() => const SuccessSendPage());
    } catch (e) {
      log(e.toString());
      Get.off(() => const FailSendPage());
    }
  }
}
