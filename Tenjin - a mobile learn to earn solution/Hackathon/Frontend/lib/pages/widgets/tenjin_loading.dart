import 'package:flutter/material.dart';

class TenjinLoading extends StatelessWidget {
  const TenjinLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return const AlertDialog(title: Center(child: CircularProgressIndicator()));
  }
}
