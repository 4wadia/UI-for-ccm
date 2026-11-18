import 'dart:ui' show FontFeature;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OnyxScale {
  final double factor;
  const OnyxScale._(this.factor);

  /// Scales typography, spacing, and controls dynamically up to a 6.9" Galaxy S26 Ultra (412x892 dp).
  factory OnyxScale.of(BuildContext context, {double? width}) {
    final size = MediaQuery.sizeOf(context);
    final w = (width ?? size.width).clamp(320.0, 448.0);
    final wFactor = w / 390.0;
    final hFactor = (size.height.clamp(620.0, 960.0)) / 844.0;
    final factor = (wFactor < hFactor ? wFactor : (wFactor * 0.7 + hFactor * 0.3))
        .clamp(0.82, 1.12);
    return OnyxScale._(factor);
  }

  double s(double base) => base * factor;
}

class OnyxPalette {
  final bool isDarkMode;

  const OnyxPalette(this.isDarkMode);

  Color get background =>
      isDarkMode ? const Color(0xFF000000) : const Color(0xFFF8F7F4);
  Color get cardSurface =>
      isDarkMode ? const Color(0xFF1C1C1F) : const Color(0xFFFFFFFF);
  Color get modalSurface =>
      isDarkMode ? const Color(0xFF1C1C1F) : const Color(0xFFF8F7F4);
  Color get primaryText =>
      isDarkMode ? const Color(0xFFF8F7F4) : const Color(0xFF111113);
  Color get mutedText => isDarkMode
      ? const Color(0xFFF8F7F4).withOpacity(0.55)
      : const Color(0xFF111113).withOpacity(0.58);
  Color get subtleText => isDarkMode
      ? const Color(0xFFF8F7F4).withOpacity(0.45)
      : const Color(0xFF111113).withOpacity(0.50);
  Color get gold =>
      isDarkMode ? const Color(0xFFD4AF37) : const Color(0xFF9A7B1C);
  Color get border => isDarkMode
      ? const Color(0xFFF8F7F4).withOpacity(0.14)
      : const Color(0xFF111113).withOpacity(0.14);
  Color get divider => isDarkMode
      ? Colors.white.withOpacity(0.10)
      : Colors.black.withOpacity(0.10);
  Color get hoverFill => isDarkMode
      ? Colors.white.withOpacity(0.10)
      : Colors.black.withOpacity(0.05);
}

class OnyxTypography {
  static TextStyle editorial({
    required double fontSize,
    FontWeight fontWeight = FontWeight.w600,
    FontStyle fontStyle = FontStyle.normal,
    Color? color,
    double? height,
    double? letterSpacing,
    bool tabularFigures = false,
  }) {
    return GoogleFonts.cormorantGaramond(
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      color: color,
      height: height,
      letterSpacing: letterSpacing,
      fontFeatures: tabularFigures ? const [FontFeature.tabularFigures()] : null,
    );
  }

  static TextStyle sans({
    required double fontSize,
    FontWeight fontWeight = FontWeight.w500,
    Color? color,
    double? height,
    double? letterSpacing,
    bool tabularFigures = false,
  }) {
    return GoogleFonts.plusJakartaSans(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: height,
      letterSpacing: letterSpacing,
      fontFeatures: tabularFigures ? const [FontFeature.tabularFigures()] : null,
    );
  }

  static TextStyle mono({
    required double fontSize,
    FontWeight fontWeight = FontWeight.w400,
    Color? color,
    double? height,
    double? letterSpacing,
    bool tabularFigures = false,
  }) {
    return GoogleFonts.ibmPlexMono(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: height,
      letterSpacing: letterSpacing,
      fontFeatures: tabularFigures ? const [FontFeature.tabularFigures()] : null,
    );
  }
}
