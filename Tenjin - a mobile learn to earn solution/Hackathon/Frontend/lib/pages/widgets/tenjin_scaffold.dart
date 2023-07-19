import 'package:flutter/material.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_bottom_navbar/tenjin_bottom_navigation_bar.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class TenjinScaffold extends StatelessWidget {
  const TenjinScaffold({
    super.key,
    this.body,
    this.enableBottomNavBar = false,
    this.removeHorizontalPadding = false,
    this.appBar,
    this.canPop = true,
  });
  final PreferredSizeWidget? appBar;
  final Widget? body;
  final bool enableBottomNavBar;
  final bool removeHorizontalPadding;
  final bool canPop;

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async => canPop,
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        appBar: appBar,
        bottomNavigationBar: (enableBottomNavBar) ? const TenjinBottomNavigationBar() : null,
        backgroundColor: TenjinColors.black,
        body: SafeArea(
          child: Padding(
            padding: removeHorizontalPadding
                ? EdgeInsets.zero
                : EdgeInsets.symmetric(
                    horizontal: getRelativeWidth(15),
                  ),
            child: body,
          ),
        ),
      ),
    );
  }
}
