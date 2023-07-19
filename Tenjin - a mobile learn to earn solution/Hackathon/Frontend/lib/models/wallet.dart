import 'dart:convert';

import 'package:thor_devkit_dart/crypto/keystore.dart';
import 'package:thor_devkit_dart/utils.dart';

class Wallet {
  final String name;
  final String address;
  final Map keystore;

  Wallet(this.name, this.address, this.keystore);

  bool verifyPassword(String password) {
    try {
      getPrivateKey(password); //* if this fails, means the password is wrong
      return true;
    } catch (e) {
      return false;
    }
  }

  String getPrivateKey(String password) {
    return bytesToHex(Keystore.decrypt(jsonEncode(keystore), password));
  }

  static Wallet fromJson(Map<String, dynamic> json) => Wallet(
        json['name'] as String,
        json['address'] as String,
        json['keystore'] as Map,
      );

  static Map<String, dynamic> toJson(Wallet instance) => <String, dynamic>{
        'name': instance.name,
        'address': instance.address,
        'keystore': instance.keystore,
      };
}
