// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:onyx_cards/main.dart';

void main() {
  testWidgets('OnyxCardsApp renders without overflow errors', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(412, 892);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(const OnyxCardsApp());
    await tester.pumpAndSettle();

    expect(find.text('TOTAL MONTH SPEND'), findsOneWidget);
    expect(find.text('Recent Activity'), findsOneWidget);

    // Exercise search bar toggle to verify zero RenderFlex overflow during animation
    await tester.tap(find.byIcon(Icons.search));
    await tester.pump(const Duration(milliseconds: 50));
    await tester.pump(const Duration(milliseconds: 150));
    await tester.pumpAndSettle();
    expect(find.byType(TextField), findsOneWidget);

    // Close search bar
    await tester.tap(find.byIcon(Icons.close));
    await tester.pump(const Duration(milliseconds: 100));
    await tester.pumpAndSettle();

    // Navigate to Cards tab
    await tester.tap(find.text('Cards'));
    await tester.pumpAndSettle();
    expect(find.text('Your Cards'), findsOneWidget);

    // Open Manage Card screen
    await tester.tap(find.text('HDFC Bank').first);
    await tester.pumpAndSettle();
    expect(find.text('Manage Card'), findsOneWidget);
  });

  testWidgets('Desktop viewport wraps app in 6.9-inch Galaxy S26 Ultra phone frame',
      (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1280, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(const OnyxCardsApp());
    await tester.pumpAndSettle();

    expect(find.text('6.9″ Galaxy S26 Ultra'), findsOneWidget);
    expect(find.text('9:41'), findsOneWidget);
    expect(find.text('5G'), findsOneWidget);
    expect(find.text('TOTAL MONTH SPEND'), findsOneWidget);
  });
}
