import 'package:flutter/material.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

class TenjinButton extends StatelessWidget {
  final String text;
  final Function() onPressed;
  final Color? color;
  final Color? backgroundColor;
  final bool expanded;

  const TenjinButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.color,
    this.backgroundColor,
    this.expanded = true,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.all(15),
          backgroundColor: backgroundColor ?? Colors.transparent,
          foregroundColor: Colors.transparent,
          side: BorderSide(
            color: backgroundColor == null ? (color ?? TenjinColors.white) : Colors.transparent,
            width: 1,
          ),
        ),
        child: expanded
            ? Center(
                child: Text(
                  text,
                  style: TenjinTypography.interMed14.copyWith(
                    color: backgroundColor == null ? (color ?? TenjinColors.white) : TenjinColors.white,
                  ),
                ),
              )
            : Text(
                text,
                style: TenjinTypography.interMed14.copyWith(
                  color: backgroundColor == null ? (color ?? TenjinColors.white) : TenjinColors.white,
                ),
              ),
      ),
    );
  }
}
