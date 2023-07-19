import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/controller/class_end_controller.dart';
import 'package:tenjin_rootstock_all/pages/class_end_pages/widgets/floating_text_card.dart';

class BouncingArea extends StatelessWidget {
  final double? height;
  final double? width;
  final Widget? child;
  final bool success;
  const BouncingArea({
    Key? key,
    this.width,
    this.height,
    this.child,
    required this.success,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (BuildContext context, BoxConstraints constraints) {
      final controller = Get.put(ClassEndController());
      controller.prepareAnimation(
        width ?? constraints.maxWidth,
        height ?? constraints.maxHeight,
        success,
      );

      /// Start (inclusive) to end (exclusive).
      List<Widget> _generateFloatingTextCards(int start, int end) {
        return [
          for (int i = start; i < end; i++)
            Obx(
              () => AnimatedPositioned(
                duration: Duration(
                  milliseconds: controller.wordSpeed.value.toInt(),
                ),
                left: controller.wordX[i].value,
                top: controller.wordY[i].value,
                child: FloatingTextCard(
                  color: controller.floatingWords[i].color,
                  text: controller.floatingWords[i].text,
                ),
              ),
            ),
        ];
      }

      List<Widget> widgets = [];
      widgets.addAll(
        _generateFloatingTextCards(0, 2),
      );
      if (child != null) widgets.add(child!);
      widgets.addAll(
        _generateFloatingTextCards(2, 5),
      );

      return SizedBox(
        height: controller.bouncingAreaHeight,
        width: controller.bouncingAreaWidth,
        child: Stack(
          children: widgets,
        ),
      );
    });
  }
}
