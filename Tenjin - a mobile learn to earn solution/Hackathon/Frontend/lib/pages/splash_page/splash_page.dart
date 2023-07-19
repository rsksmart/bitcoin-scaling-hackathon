import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/pages/login_page/login_page.dart';
import 'package:tenjin_rootstock_all/services/auth_service.dart';

import '../learn_page/learn_page.dart';
import 'controller/splash_controller.dart';

class SplashPage extends GetView<SplashController> {
  const SplashPage({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(SplashController());
    return FutureBuilder<bool>(
      future: controller.loadServices(),
      builder: (ctx, snapshot) {
        // Checking if future is resolved
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (snapshot.connectionState == ConnectionState.done) {
          // If we got an error
          if (snapshot.hasError) {
            return Center(
              child: Text(
                '${snapshot.error} occurred',
                style: const TextStyle(fontSize: 18),
              ),
            );

            // if we got our data
          } else if (snapshot.hasData) {
            if (Get.find<AuthService>().isLogged.value) {
              return const LearnPage();
            } else {
              return const LoginPage();
            }
          }
        }
        return const Center(
          child: Text('Fatal Error, this should never happen.'),
        );
      },
    );
  }
}
