import 'package:flutter/material.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';

class TenjinBorder extends StatelessWidget {
  final Widget child;
  const TenjinBorder({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        border: Border.all(color: TenjinColors.white),
        borderRadius: BorderRadius.circular(15),
      ),
      child: child,
    );
  }
}
