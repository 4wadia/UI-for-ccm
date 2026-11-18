import 'package:flutter/material.dart';
import '../models/financial_models.dart';
import '../theme/onyx_theme.dart';
import '../widgets/physical_credit_card.dart';

class CardsScreen extends StatelessWidget {
  final List<CreditCardModel> cards;
  final VoidCallback onOpenNewCardModal;
  final ValueChanged<CreditCardModel> onSelectCard;
  final bool isDarkMode;

  const CardsScreen({
    super.key,
    required this.cards,
    required this.onOpenNewCardModal,
    required this.onSelectCard,
    required this.isDarkMode,
  });

  @override
  Widget build(BuildContext context) {
    final palette = OnyxPalette(isDarkMode);

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 84),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Top Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${cards.length} ACTIVE CARDS',
                    style: OnyxTypography.mono(
                      fontSize: 9,
                      color: palette.mutedText,
                      letterSpacing: 1.1,
                    ),
                  ),
                  Text(
                    'Your Cards',
                    style: OnyxTypography.editorial(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: palette.primaryText,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: onOpenNewCardModal,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isDarkMode
                        ? const Color(0xFFD4AF37)
                        : const Color(0xFF111113),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.add,
                        size: 14,
                        color: isDarkMode
                            ? const Color(0xFF111113)
                            : const Color(0xFFF8F7F4),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Add Card',
                        style: OnyxTypography.sans(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: isDarkMode
                              ? const Color(0xFF111113)
                              : const Color(0xFFF8F7F4),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Tight Vertical Stack of Original-Color Borderless Physical Cards
          for (int i = 0; i < cards.length; i++) ...[
            PhysicalCreditCard(
              card: cards[i],
              onTap: () => onSelectCard(cards[i]),
            ),
            if (i < cards.length - 1) const SizedBox(height: 12),
          ],
        ],
      ),
    );
  }
}
