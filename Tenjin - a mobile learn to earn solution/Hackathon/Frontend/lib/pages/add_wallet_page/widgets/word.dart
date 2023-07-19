import 'package:flutter/material.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';
import 'package:tenjin_rootstock_all/utils/utils.dart';

class Word extends StatelessWidget {
  final int index;
  final String word;
  final bool showIndex;
  final Function(String)? onTap;

  const Word({
    super.key,
    required this.index,
    required this.word,
    this.showIndex = true,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onTap?.call(word),
      child: Container(
        height: getRelativeHeight(40),
        width: getRelativeWidth(150),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(4),
          color: TenjinColors.white20,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            if (showIndex) ...[
              Text(
                index.toString(),
                style: TenjinTypography.interMed14.copyWith(
                  color: TenjinColors.orange,
                ),
              ),
              const VerticalDivider(
                color: TenjinColors.orange,
              ),
            ],
            Text(
              word,
              style: TenjinTypography.interMed14.copyWith(
                color: TenjinColors.orange,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
