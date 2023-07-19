import 'package:flutter/material.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

class FloatingTextCard extends StatelessWidget {
  final Color color;
  final String text;
  const FloatingTextCard({
    Key? key,
    required this.color,
    required this.text,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: color,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(128),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(6.0, 4.0, 6.0, 4.0),
        child: Text(
          text,
          style: TenjinTypography.interMed14,
        ),
      ),
    );
  }
}
