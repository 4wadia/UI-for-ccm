import 'package:flutter/material.dart';
import '../models/financial_models.dart';
import '../theme/onyx_theme.dart';

class FloatingPillNav extends StatelessWidget {
  final ScreenId activeTab;
  final ValueChanged<ScreenId> onSelectTab;
  final bool isDarkMode;

  const FloatingPillNav({
    super.key,
    required this.activeTab,
    required this.onSelectTab,
    required this.isDarkMode,
  });

  @override
  Widget build(BuildContext context) {
    final pillBackground =
        isDarkMode ? const Color(0xFF1C1C1F) : const Color(0xFFFFFFFF);
    final activeIndicator =
        isDarkMode ? const Color(0xFFF8F7F4) : const Color(0xFF111113);
    final activeTextColor =
        isDarkMode ? const Color(0xFF111113) : const Color(0xFFF8F7F4);
    final inactiveTextColor = isDarkMode
        ? const Color(0xFFF8F7F4).withOpacity(0.65)
        : const Color(0xFF111113).withOpacity(0.65);

    const double pillWidth = 210;
    const double padding = 4;
    const double indicatorWidth = (pillWidth - padding * 2) / 2;

    return Container(
      width: pillWidth,
      height: 40,
      padding: const EdgeInsets.all(padding),
      decoration: BoxDecoration(
        color: pillBackground,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Stack(
        children: [
          // Sliding Active Pill Indicator
          AnimatedAlign(
            duration: const Duration(milliseconds: 300),
            curve: const Cubic(0.22, 1.0, 0.36, 1.0),
            alignment: activeTab == ScreenId.home
                ? Alignment.centerLeft
                : Alignment.centerRight,
            child: Container(
              width: indicatorWidth,
              height: double.infinity,
              decoration: BoxDecoration(
                color: activeIndicator,
                borderRadius: BorderRadius.circular(999),
              ),
            ),
          ),

          // Nav Tab Labels
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onSelectTab(ScreenId.home),
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: OnyxTypography.sans(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: activeTab == ScreenId.home
                            ? activeTextColor
                            : inactiveTextColor,
                      ),
                      child: const Text('Home'),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onSelectTab(ScreenId.cards),
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: OnyxTypography.sans(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: activeTab == ScreenId.cards
                            ? activeTextColor
                            : inactiveTextColor,
                      ),
                      child: const Text('Cards'),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
