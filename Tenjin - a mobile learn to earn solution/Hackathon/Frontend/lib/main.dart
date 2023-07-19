import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/splash_page/splash_page.dart';
import 'package:tenjin_rootstock_all/theme/tenjin_colors/tenjin_colors.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Tenjin',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: TenjinColors.orange),
        useMaterial3: true,
      ),
      home: const SplashPage(),
    );
  }
}
