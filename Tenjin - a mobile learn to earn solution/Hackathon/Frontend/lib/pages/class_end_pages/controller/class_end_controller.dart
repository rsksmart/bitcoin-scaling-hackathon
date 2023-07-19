import 'dart:async';

import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/models/floating_word.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'dart:math' as math;

class ClassEndController extends GetxController with GetTickerProviderStateMixin {
  final List<FloatingWord> floatingWordsSuccess = [
    FloatingWord('PROGRESS', TenjinColors.white, 91.0, -1.0),
    FloatingWord('MASTERY', TenjinColors.orange, 84.0, 0.8),
    FloatingWord('SUCCESS', TenjinColors.pink, 81.0, 0.7),
    FloatingWord('ACHIEVEMENT', TenjinColors.orange, 117.0, -0.6),
    FloatingWord('EMPOWERMENT', TenjinColors.green, 127.0, 0.9),
  ];

  final List<FloatingWord> floatingWordsFail = [
    FloatingWord('LEARN AND GROW', TenjinColors.white, 144.0, -1.0),
    FloatingWord('MASTERY', TenjinColors.orange, 84.0, 0.8),
    FloatingWord('TRY AGAIN', TenjinColors.pink, 89.0, 0.7),
    FloatingWord('KEEP GOING', TenjinColors.orange, 101.0, -0.6),
    FloatingWord('EMPOWERMENT', TenjinColors.green, 127.0, 0.9),
  ];

  final List<FloatingWord> floatingWordsReward = [
    FloatingWord('REWARDS', TenjinColors.white, 0.0, 0.0),
    FloatingWord('UNLOCKING', TenjinColors.orange, 0.0, 0.0),
    FloatingWord('UNVEILING', TenjinColors.pink, 0.0, 0.0),
    FloatingWord('THRILL', TenjinColors.green, 0.0, 0.0),
    FloatingWord('SURPRISES', TenjinColors.green, 0.0, 0.0),
  ];

  late final List<FloatingWord> floatingWords;

  late List<RxDouble> wordX = [];
  late List<RxDouble> wordY = [];
  late List<RxDouble> wordXSpeed = [];
  List<RxDouble> wordYSpeed = [];
  RxDouble wordSpeed = (150.0).obs;
  late double bouncingAreaWidth;
  late double bouncingAreaHeight;
  double wordHeight = 28.0;
  bool animationOnGoing = false;

  final rand = math.Random();

  RxInt score = (-1).obs;
  RxInt totalQuestions = (-1).obs; 
  RxInt xpCollected = (-1).obs; 

  void prepareAnimation(double width, double height, bool success) {
    if (animationOnGoing) return;
    if (success) {
      floatingWords = floatingWordsSuccess;
    } else {
      floatingWords = floatingWordsFail;
    }
    bouncingAreaWidth = width;
    bouncingAreaHeight = height;
    for (final word in floatingWordsSuccess) {
      double randX = rand.nextDouble() * bouncingAreaWidth;
      double randY = rand.nextDouble() * bouncingAreaHeight;
      wordX.add((randX > bouncingAreaWidth - word.width ? bouncingAreaWidth - word.width : randX).obs);
      wordY.add((randY > bouncingAreaHeight - wordHeight ? bouncingAreaHeight - wordHeight : randY).obs);
      wordXSpeed.add((4.0 * word.speedFactor).obs);
      wordYSpeed.add((4.0 * word.speedFactor).obs);
    }
    animate();
    animationOnGoing = true;
  }

  void animate() {
    Timer.periodic(Duration(milliseconds: wordSpeed.value.toInt()), (timer) {
      for (int i = 0; i < floatingWordsSuccess.length; i++) {
        wordX[i].value += wordXSpeed[i].value;
        wordY[i].value += wordYSpeed[i].value;

        if (wordX[i].value + floatingWords[i].width >= bouncingAreaWidth) {
          wordXSpeed[i].value = -wordXSpeed[i].value;
          wordX[i].value = bouncingAreaWidth - floatingWords[i].width;
        } else if (wordX[i].value <= 0) {
          wordXSpeed[i].value = -wordXSpeed[i].value;
          wordX[i].value = 0;
        }

        if (wordY[i].value + wordHeight >= bouncingAreaHeight) {
          wordYSpeed[i].value = -wordYSpeed[i].value;
          wordY[i].value = bouncingAreaHeight - wordHeight;
        } else if (wordY[i].value <= 0) {
          wordYSpeed[i].value = -wordYSpeed[i].value;
          wordY[i].value = 0;
        }
      }
    });
  }

}
