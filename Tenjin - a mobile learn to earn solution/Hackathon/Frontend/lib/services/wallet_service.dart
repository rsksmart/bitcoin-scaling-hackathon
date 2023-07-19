import 'dart:convert';

import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tenjin_rootstock_all/models/wallet.dart';

class WalletService extends GetxService {
  late SharedPreferences prefs;

  final Rxn<Wallet> _wallet = Rxn<Wallet>();
  Wallet? get wallet => _wallet.value;

  Future<void> init() async {
    prefs = await SharedPreferences.getInstance();
    _wallet.value = await _loadWallet();
  }

  Future<Wallet?> _loadWallet() async {
    if (!prefs.containsKey('wallet')) return null;

    String walletString = prefs.getString('wallet')!;
    return Wallet.fromJson(jsonDecode(walletString));
  }

  Future<void> saveWallet(Wallet wallet) async {
    await prefs.setString('wallet', jsonEncode(Wallet.toJson(wallet)));
    _wallet.value = wallet;
  }

  Future<void> deleteWallet() async {
    await prefs.remove('wallet');
    _wallet.value = null;
  }
}
