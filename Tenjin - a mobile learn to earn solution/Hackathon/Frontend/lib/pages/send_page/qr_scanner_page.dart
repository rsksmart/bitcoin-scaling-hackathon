
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:tenjin_rootstock_all/pages/widgets/tenjin_scaffold.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_typography/tenjin_typography.dart';

class QrScannerPage extends StatelessWidget {
  QrScannerPage({super.key});

  final mobileScannerController = MobileScannerController();

  @override
  Widget build(BuildContext context) {
    return TenjinScaffold(
      appBar: AppBar(
        centerTitle: true,
        backgroundColor: Colors.transparent,
        foregroundColor: TenjinColors.white,
        title: Text(
          'Scan wallet address',
          style: TenjinTypography.interMed22.copyWith(
            color: TenjinColors.white,
          ),
        ),
      ),
      body: MobileScanner(
        controller: mobileScannerController,
        onDetect: (barcodes) {
          mobileScannerController.dispose();
          Get.back(result: barcodes.barcodes.first.displayValue);
        },
      ),
    );
  }
}
