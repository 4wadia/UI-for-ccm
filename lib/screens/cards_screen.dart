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
    final scale = OnyxScale.of(context);

    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(
        scale.s(22),
        scale.s(18),
        scale.s(22),
        scale.s(90),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Top Header
          Padding(
            padding: EdgeInsets.only(top: scale.s(12), bottom: scale.s(6)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${cards.length} ACTIVE CARDS',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: OnyxTypography.mono(
                          fontSize: scale.s(11),
                          color: palette.mutedText,
                          letterSpacing: 1.3,
                        ),
                      ),
                      SizedBox(height: scale.s(4)),
                      Text(
                        'Your Cards',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: OnyxTypography.editorial(
                          fontSize: scale.s(36),
                          fontWeight: FontWeight.w600,
                          height: 1.05,
                          color: palette.primaryText,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(width: scale.s(12)),
                GestureDetector(
                  onTap: onOpenNewCardModal,
                  child: Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: scale.s(18),
                      vertical: scale.s(12),
                    ),
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
                          size: scale.s(17),
                          color: isDarkMode
                              ? const Color(0xFF111113)
                              : const Color(0xFFF8F7F4),
                        ),
                        SizedBox(width: scale.s(6)),
                        Text(
                          'Add Card',
                          style: OnyxTypography.sans(
                            fontSize: scale.s(13.5),
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
          ),

          SizedBox(height: scale.s(28)),

          // Tight Vertical Stack of Original-Color Borderless Physical Cards
          for (int i = 0; i < cards.length; i++) ...[
            PhysicalCreditCard(
              card: cards[i],
              onTap: () => onSelectCard(cards[i]),
            ),
            if (i < cards.length - 1) SizedBox(height: scale.s(20)),
          ],
        ],
      ),
    );
  }
}
