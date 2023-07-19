import 'package:flutter/material.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

class UserTile extends StatelessWidget {
  final String? username;
  final String? address;
  final String? photoUrl;
  final Color usernameColor;
  final Color addressColor;
  const UserTile({
    Key? key,
    this.username,
    this.address,
    this.photoUrl,
    this.usernameColor = TenjinColors.green,
    this.addressColor = TenjinColors.white,
  })  : assert(address != null || username != null),
        super(key: key);

  String _formatAddress(String address) {
    if (address.length < 10) return address;
    try {
      return '${address.substring(0, 4)}...${address.substring(address.length - 5)}';
    } catch (e) {
      return address;
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return IntrinsicHeight(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FittedBox(
            fit: BoxFit.cover,
            child: photoUrl != null
                ? CircleAvatar(
                    backgroundImage: NetworkImage(
                      photoUrl!,
                    ),
                  )
                : Icon(
                    Icons.account_circle,
                    color: addressColor,
                  ),
          ),
          SizedBox(width: screenSize.width * 0.02),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (username != null)
                  Text(
                    username!,
                    style: TenjinTypography.interMed14.copyWith(color: usernameColor),
                  ),
                if (username != null && address != null) SizedBox(height: screenSize.height * 0.005),
                if (address != null)
                  Text(
                    _formatAddress(address!),
                    style: TenjinTypography.interMed14.copyWith(color: addressColor),
                  ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
