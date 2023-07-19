import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:tenjin_rootstock_all/pages/login_page/login_page.dart';
import 'package:tenjin_rootstock_all/services/secure_storage_service.dart';
import 'package:tenjin_rootstock_all/services/user_service.dart';

import '../models/user.dart';
import '../models/user_profile_model.dart';
import '../models/userstatistic_model.dart';
import '../utils/constants.dart';

class AuthService extends GetxService {
  String authenticationToken = "";
  var registrationError = '';
  UserService userService = Get.put(UserService());
  SecureStorageService secureStorageService = Get.put(SecureStorageService());
  RxBool isLogged = false.obs;

  Future<AuthService> init() async {
    debugPrint('AuthService - initializing ...');
    // search for a token in the secure storage
    bool isUserInStorage = await secureStorageService.isUserInStorage();
    if (isUserInStorage) {
      // check token validity
      bool isTokenValid = await this.isTokenValid(secureStorageService.storedContent.accessToken);
      if (isTokenValid) {
        /// TODO refresh the token if needed
        // set the auth token for this session
        authenticationToken = secureStorageService.storedContent.accessToken;
        debugPrint("AuthService - user token: $authenticationToken");
        userService.user.value = await getUser();
        userService.userStatistics.value = await getUserStatistic();
        userService.userProfile.value = await getUserProfile(userService.user.value!.id);
        // userStateController.userStatistic.value = await getUserStatistics();

        if (userService.userStatistics.value!.id != -1) {
          isLogged.value = true;
        }
      }
    }
    debugPrint('AuthService - done.');
    return this;
  }

  Future<String> registration(String email, String password, String username) async {
    print("AuthService - starting registration");
    var url = Uri.parse('${Constants.domain}/auth/registration/');
    var body = json.encode({
      "email": email,
      "password1": password,
      "password2": password,
      "username": username
    });
    final response = await http.post(url,
        headers: {
          "Content-Type": "application/json"
        },
        body: body);
    print("AuthService - got response");

    if (response.statusCode == 201) {
      try {
        Map<String, dynamic> userMap = jsonDecode(response.body);

        /// save the token
        authenticationToken = userMap[Constants.accessToken];
        print("AuthService - authenticationToken: $authenticationToken");

        // Get User models
        userService.user.value = await getUser();
        userService.userStatistics.value = await getUserStatistic();
        userService.userProfile.value = await getUserProfile(userService.user.value!.id);

        // Save access and refresh token to secure storage
        secureStorageService.storedContent.accessToken = authenticationToken;
        secureStorageService.storedContent.refreshToken = userService.user.value!.email;

        await secureStorageService.storeAndOverwrite(secureStorageService.storedContent);

        return "";
      } catch (error) {
        throw "AuthService - error while parsing the user: $error";
      }
    } else {
      print("AuthService - error while registering the user with statusCode ${response.body}");
      registrationError = response.body;
      return registrationError;
    }
  }

  Future<String> login(String email, String password) async {
    print("AuthService - starting login");
    var url = Uri.parse('${Constants.domain}/auth/login/');
    var body = json.encode({
      "email": email,
      "password": password
    });
    final response = await http.post(url,
        headers: {
          "Content-Type": "application/json",
        },
        body: body);
    print("AuthService - got response");

    if (response.statusCode == 200) {
      Map<String, dynamic> userMap = jsonDecode(response.body);
      authenticationToken = userMap[Constants.accessToken];
      print(userMap);
      print("AuthService - authenticationToken: $authenticationToken");

      // Get User models
      userService.user.value = await getUser();
      userService.userStatistics.value = await getUserStatistic();
      userService.userProfile.value = await getUserProfile(userService.user.value!.id);

      // Save access and refresh token to secure storage
      secureStorageService.storedContent.accessToken = authenticationToken;
      secureStorageService.storedContent.refreshToken = userService.user.value!.email;

      await secureStorageService.storeAndOverwrite(secureStorageService.storedContent);

      return "";
    } else {
      print('Error while loggin in with status code ${response.statusCode}');
      return ("AuthService - error while loggin in with status code ${response.statusCode}");
    }
  }

  Future<bool> isTokenValid(String accessToken) async {
    var url = Uri.parse('${Constants.domain}/auth/token/verify/');
    var body = {
      "token": accessToken,
    };
    final response = await http.post(url, body: body);
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  redeem(int amount) async {
    print("GetUserProfile - starting getting User Profile");
    print(amount);
    amount = 1;
    var url = Uri.parse('${Constants.domain}/api/users/status/payment/${amount.toString()}/');
    final response = await http.patch(url, headers: {
      "Content-Type": "application/json",
      HttpHeaders.authorizationHeader: "Bearer $authenticationToken"
    });
    print("GetUser - got response");
    print(response.statusCode);
    if (response.statusCode == 200) {
      Map<String, dynamic> jsonMap = jsonDecode(response.body);
      return UserProfile.fromJson(jsonMap);
    } else {
      throw ("GetUser - error while callin Payout in with status code ${response.statusCode}");
    }
  }

  Future<UserProfile> getUserProfile(int userId) async {
    print("GetUserProfile - starting getting User Profile");
    var url = Uri.parse('${Constants.domain}/api/users/me/$userId');

    final response = await http.get(url, headers: {
      "Content-Type": "application/json",
      HttpHeaders.authorizationHeader: "Bearer $authenticationToken"
    });
    print("GetUser - got response");

    if (response.statusCode == 200) {
      Map<String, dynamic> jsonMap = jsonDecode(response.body);
      return UserProfile.fromJson(jsonMap);
    } else {
      throw ("GetUser - error while getting all lessons in with status code ${response.statusCode}");
    }
  }

  Future<User> getUser() async {
    print("GetUser - starting getting User");
    var url = Uri.parse('${Constants.domain}/auth/user/');

    final response = await http.get(url, headers: {
      "Content-Type": "application/json",
      HttpHeaders.authorizationHeader: "Bearer $authenticationToken"
    });
    print("GetUser - got response");

    if (response.statusCode == 200) {
      Map<String, dynamic> jsonMap = jsonDecode(response.body);
      return User.fromJson(jsonMap);
    } else {
      throw ("GetUser - error while getting all lessons in with status code ${response.statusCode}");
    }
  }

  Future<UserStatistics> getUserStatistic() async {
    print("GetUserStatistic - starting getting Userstatistics");
    var url = Uri.parse('${Constants.domain}/api/users/status/');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer $authenticationToken"
      },
    );
    print("GetUserStatistic - got response");

    if (response.statusCode == 200) {
      Map<String, dynamic> jsonMap = jsonDecode(response.body).first;
      return UserStatistics.fromJson(jsonMap);
    } else {
      throw ("GetUserStatistic - error while getting all lessons in with status code ${response.statusCode}");
    }
  }

  Future logout() async {
    debugPrint("AuthService - logging out");

    var url = Uri.parse('${Constants.domain}/auth/logout/');
    await secureStorageService.getStoredContent();

    final response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer $authenticationToken"
      },
    );
    debugPrint("AuthService - got response");
    if (response.statusCode == 200) {
      authenticationToken = "";
      secureStorageService.storage.delete(key: Constants.refreshToken);
      secureStorageService.storage.delete(key: Constants.accessToken);
      userService.clear();
      Get.offAll(() => const LoginPage());
      return "AuthService - log out";
    } else {
      throw "AuthService - error while loggin in with status code ${response.statusCode}";
    }
  }

  updateWalletAddress(String address) async {
    print("UpdateWalletAddress - starting updating user's wallet address");
    var url = Uri.parse('${Constants.domain}/api/users/me/${userService.user.value!.id}');
    var body = jsonEncode({
      "wallet_address": address,
    });

    final response = await http.patch(
      url,
      body: body,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer $authenticationToken",
      },
    );

    print("UpdateWalletAddress - got response");

    if (response.statusCode == 200) {
    } else {
      throw ("UpdateWalletAddress - error while updating user's wallet address with status code ${response.statusCode}");
    }
  }
}
