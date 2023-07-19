import 'dart:convert';
import 'dart:typed_data';

import 'package:tenjin_rootstock_all/models/wallet.dart';
import 'package:thor_devkit_dart/crypto/address.dart';
import 'package:thor_devkit_dart/crypto/hd_node.dart';
import 'package:thor_devkit_dart/crypto/keystore.dart';
import 'package:thor_devkit_dart/crypto/mnemonic.dart';
import 'package:thor_devkit_dart/crypto/secp256k1.dart';

class WalletUtils {
  static List<String> generateSeedPhrase() {
    return Mnemonic.generate();
  }

  static Future createWallet(String password, List<String> seedPhrase) async {
    Uint8List privateKey = HDNode.fromMnemonic(seedPhrase).privateKey!;
    String keystoreString = Keystore.encrypt(privateKey, password);
    String address = Address.publicKeyToAddressString(derivePublicKeyFromBytes(privateKey, false));
    return Wallet('Wallet', address, jsonDecode(keystoreString));
  }
}
