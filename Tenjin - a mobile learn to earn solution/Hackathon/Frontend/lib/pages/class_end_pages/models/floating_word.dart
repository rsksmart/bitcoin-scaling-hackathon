import 'package:flutter/material.dart';

class FloatingWord {
  final String text;
  final Color color;
  final double width;

  /// 0.0 to 1.0
  final double speedFactor;

  FloatingWord(
    this.text,
    this.color,
    this.width,
    this.speedFactor,
  );
}
