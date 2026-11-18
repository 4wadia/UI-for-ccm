import 'package:flutter/material.dart';
import '../theme/onyx_theme.dart';

/// Wraps the Flutter Navigator in a realistic 6.9" Samsung Galaxy S26 Ultra
/// titanium device frame (`19.5:9`, `412x892` logical dp) when viewed on wide
/// desktop/tablet web viewports, and renders edge-to-edge on mobile viewports.
class GalaxyS26UltraFrame extends StatelessWidget {
  final bool isDarkMode;
  final Widget child;

  const GalaxyS26UltraFrame({
    super.key,
    required this.isDarkMode,
    required this.child,
  });

  static const double screenWidth = 412.0;
  static const double screenHeight = 892.0;
  static const double statusBarHeight = 36.0;
  static const double bezelThickness = 7.0;

  @override
  Widget build(BuildContext context) {
    final palette = OnyxPalette(isDarkMode);

    return LayoutBuilder(
      builder: (context, constraints) {
        // On genuine narrow mobile viewports, render full-screen edge-to-edge.
        if (constraints.maxWidth < 500) {
          return child;
        }

        final stageBg = palette.background;
        final statusInk = palette.primaryText.withValues(alpha: 0.65);

        const chassisWidth = screenWidth + bezelThickness * 2;
        const chassisHeight = screenHeight + bezelThickness * 2;

        return Material(
          color: stageBg,
          child: Column(
            children: [
              // Subtle editorial top bar
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: palette.divider),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Onyx Cards',
                          style: OnyxTypography.editorial(
                            fontSize: 22,
                            fontWeight: FontWeight.w600,
                            fontStyle: FontStyle.italic,
                            color: palette.primaryText,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Text(
                          '6.9″ Galaxy S26 Ultra',
                          style: OnyxTypography.mono(
                            fontSize: 10,
                            color: palette.mutedText,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '412 × 892 DP',
                      style: OnyxTypography.mono(
                        fontSize: 10,
                        color: palette.subtleText,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ],
                ),
              ),

              // Centered Galaxy S26 Ultra Phone Chassis scaled cleanly to viewport
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  child: Center(
                    child: FittedBox(
                      fit: BoxFit.contain,
                      child: Container(
                        width: chassisWidth,
                        height: chassisHeight,
                        padding: const EdgeInsets.all(bezelThickness),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(28),
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: isDarkMode
                                ? const [Color(0xFF27272C), Color(0xFF141418)]
                                : const [Color(0xFF323238), Color(0xFF1C1C20)],
                          ),
                          border: Border.all(
                            width: 1.5,
                            color: isDarkMode
                                ? const Color(0xFFD6D2C8)
                                    .withValues(alpha: 0.28)
                                : const Color(0xFF78746C)
                                    .withValues(alpha: 0.45),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black
                                  .withValues(alpha: isDarkMode ? 0.55 : 0.18),
                              blurRadius: 36,
                              offset: const Offset(0, 18),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(22),
                          child: Container(
                            width: screenWidth,
                            height: screenHeight,
                            decoration: BoxDecoration(
                              color: palette.background,
                              borderRadius: BorderRadius.circular(22),
                              border: Border.all(
                                color: isDarkMode
                                    ? const Color(0xFFF8F7F4)
                                        .withValues(alpha: 0.08)
                                    : const Color(0xFF111113)
                                        .withValues(alpha: 0.10),
                              ),
                            ),
                            child: Column(
                              children: [
                                // Galaxy S26 Ultra Status Bar & Punch-Hole Camera
                                SizedBox(
                                  height: statusBarHeight,
                                  child: Padding(
                                    padding: const EdgeInsets.only(
                                      left: 20,
                                      right: 20,
                                      top: 4,
                                    ),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          '9:41',
                                          style: OnyxTypography.mono(
                                            fontSize: 10.5,
                                            color: statusInk,
                                            letterSpacing: 1.0,
                                          ),
                                        ),
                                        Container(
                                          width: 11,
                                          height: 11,
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            gradient: const RadialGradient(
                                              center: Alignment(-0.25, -0.25),
                                              colors: [
                                                Color(0xFF262E42),
                                                Color(0xFF09090B),
                                              ],
                                              stops: [0.0, 0.72],
                                            ),
                                            border: Border.all(
                                              color: isDarkMode
                                                  ? Colors.white
                                                      .withValues(alpha: 0.14)
                                                  : Colors.black
                                                      .withValues(alpha: 0.22),
                                            ),
                                          ),
                                        ),
                                        Text(
                                          '5G',
                                          style: OnyxTypography.mono(
                                            fontSize: 10.5,
                                            color: statusInk,
                                            letterSpacing: 1.0,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),

                                // Clipped 412x856 Inner App Viewport
                                Expanded(
                                  child: MediaQuery(
                                    data: MediaQuery.of(context).copyWith(
                                      size: const Size(
                                        screenWidth,
                                        screenHeight - statusBarHeight,
                                      ),
                                      padding: EdgeInsets.zero,
                                      viewPadding: EdgeInsets.zero,
                                      viewInsets: EdgeInsets.zero,
                                    ),
                                    child: child,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
