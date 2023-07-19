import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/utils/constants.dart';

import '../models/secure_storage_content_model.dart';

class SecureStorageService extends GetxService {
  final storage = const FlutterSecureStorage();

  SecureStorageContent storedContent = SecureStorageContent();

  Future<bool> isKeyInStorage(String key) async {
    bool isKeyInStorage = await storage.containsKey(key: key);
    return isKeyInStorage;
  }

  Future<bool> isUserInStorage() async {
    bool isAccessTokenInStorage =
        await storage.containsKey(key: Constants.accessToken);
    return isAccessTokenInStorage;
  }

  Future<void> getStoredContent() async {
    Map<String, String> allValues = await storage.readAll();
    storedContent = SecureStorageContent.fromJson(allValues);
  }

  Future<void> init() async {
    debugPrint('SecureStorageService - initializing ...');
    await getStoredContent();
    debugPrint('SecureStorageService - done.');
    return;
  }

  Future<void> storeAndOverwrite(SecureStorageContent storedContent) async {
    await storage.write(
        key: Constants.accessToken, value: storedContent.accessToken);
    await storage.write(
        key: Constants.refreshToken, value: storedContent.accessToken);
  }
}
