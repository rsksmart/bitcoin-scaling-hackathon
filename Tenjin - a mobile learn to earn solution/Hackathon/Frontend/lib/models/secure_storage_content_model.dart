
import '../utils/constants.dart';

class SecureStorageContent {
  String accessToken = "";
  String refreshToken = "";

  SecureStorageContent();

    SecureStorageContent.fromString(
      {required this.accessToken,
      required this.refreshToken,
    });

  SecureStorageContent.fromJson(Map<String, dynamic> json)
      : accessToken = json.containsKey(Constants.accessToken)
            ? json[Constants.accessToken]
            : "",
        refreshToken = json.containsKey(Constants.refreshToken)
            ? json[Constants.refreshToken]
            : ""
    ;

  Map<String, dynamic> toJson() => {
        Constants.accessToken: accessToken,
        Constants.refreshToken: refreshToken,
      };


}