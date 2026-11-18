import 'package:flutter/material.dart';
import '../models/financial_models.dart';
import '../theme/onyx_theme.dart';
import '../utils/card_helpers.dart';

class CardSupplierMark extends StatelessWidget {
  final CardSupplier brand;
  final bool isLight;

  const CardSupplierMark({
    super.key,
    required this.brand,
    required this.isLight,
  });

  @override
  Widget build(BuildContext context) {
    final scale = OnyxScale.of(context);
    final textColor =
        isLight ? const Color(0xFF111113) : const Color(0xFFF8F7F4);

    switch (brand) {
      case CardSupplier.rupay:
        return Text(
          'RuPay',
          style: OnyxTypography.sans(
            fontSize: scale.s(16),
            fontWeight: FontWeight.w700,
            color: textColor,
            letterSpacing: -0.3,
          ),
        );
      case CardSupplier.visa:
        return Text(
          'VISA',
          style: OnyxTypography.sans(
            fontSize: scale.s(18),
            fontWeight: FontWeight.w800,
            color: textColor,
            letterSpacing: -0.6,
          ).copyWith(fontStyle: FontStyle.italic),
        );
      case CardSupplier.mastercard:
        return SizedBox(
          width: scale.s(30),
          height: scale.s(18),
          child: Stack(
            children: [
              Positioned(
                left: 0,
                child: Container(
                  width: scale.s(18),
                  height: scale.s(18),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFFEB001B).withValues(alpha: 0.92),
                  ),
                ),
              ),
              Positioned(
                left: scale.s(11),
                child: Container(
                  width: scale.s(18),
                  height: scale.s(18),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFFF79E1B).withValues(alpha: 0.92),
                  ),
                ),
              ),
            ],
          ),
        );
      case CardSupplier.amex:
        return Text(
          'AMEX',
          style: OnyxTypography.sans(
            fontSize: scale.s(13.5),
            fontWeight: FontWeight.w700,
            color: textColor,
            letterSpacing: 1.0,
          ),
        );
      case CardSupplier.diners:
        return Text(
          'DINERS',
          style: OnyxTypography.sans(
            fontSize: scale.s(13.5),
            fontWeight: FontWeight.w700,
            color: textColor,
            letterSpacing: 1.4,
          ),
        );
    }
  }
}

class PhysicalCreditCard extends StatelessWidget {
  final CreditCardModel card;
  final VoidCallback? onTap;
  final double aspectRatio;

  const PhysicalCreditCard({
    super.key,
    required this.card,
    this.onTap,
    this.aspectRatio = 1.56,
  });

  @override
  Widget build(BuildContext context) {
    final scale = OnyxScale.of(context);
    final originalColor = fetchOriginalCardColor(
      card.bankName,
      card.cardTier,
      card.brand,
    );
    final bgColor = card.isFrozen
        ? const Color(0xFF18181B)
        : (card.cardColorValue != null
            ? Color(card.cardColorValue!)
            : originalColor.color);
    final isLight = card.isFrozen
        ? false
        : (card.isLightCard ?? originalColor.isLight);
    final inkColor =
        isLight ? const Color(0xFF111113) : const Color(0xFFF8F7F4);
    final variantLabel = formatVariantLabel(card.bankName, card.cardTier);
    final last4 = card.maskedNumber.length >= 4
        ? card.maskedNumber.substring(card.maskedNumber.length - 4)
        : '5168';

    Widget cardBody = AspectRatio(
      aspectRatio: aspectRatio,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(scale.s(14)),
        child: Container(
          color: bgColor,
          child: Stack(
            children: [
              Padding(
                padding: EdgeInsets.all(scale.s(20)),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Top Row: Editorial "O" + Bank Name + Variant Label
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
                          flex: 3,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'O',
                                style: OnyxTypography.editorial(
                                  fontSize: scale.s(22),
                                  fontWeight: FontWeight.w700,
                                  fontStyle: FontStyle.italic,
                                  color: !card.isFrozen &&
                                          originalColor.accentColor != null
                                      ? originalColor.accentColor
                                      : inkColor,
                                ),
                              ),
                              SizedBox(width: scale.s(8)),
                              Flexible(
                                child: Text(
                                  card.bankName.displayName,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: OnyxTypography.sans(
                                    fontSize: scale.s(17),
                                    fontWeight: FontWeight.w600,
                                    color: inkColor,
                                    letterSpacing: -0.2,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(width: scale.s(8)),
                        Flexible(
                          flex: 2,
                          child: Text(
                            variantLabel.toUpperCase(),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: OnyxTypography.mono(
                              fontSize: scale.s(11),
                              color: inkColor.withValues(alpha: 0.78),
                              letterSpacing: 1.1,
                            ),
                          ),
                        ),
                      ],
                    ),

                    // Bottom Row: Holder + Masked Number + Network Logo
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                card.holderName.isNotEmpty
                                    ? card.holderName
                                    : 'ARJUN SHARMA',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: OnyxTypography.sans(
                                  fontSize: scale.s(14),
                                  fontWeight: FontWeight.w500,
                                  color: inkColor,
                                ),
                              ),
                              SizedBox(height: scale.s(3)),
                              Text(
                                '•••• $last4',
                                style: OnyxTypography.mono(
                                  fontSize: scale.s(13),
                                  color: inkColor.withValues(alpha: 0.8),
                                  letterSpacing: 1.6,
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(width: scale.s(12)),
                        CardSupplierMark(
                          brand: card.brand,
                          isLight: isLight,
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              if (card.isFrozen)
                Positioned.fill(
                  child: Container(
                    color: Colors.black.withValues(alpha: 0.85),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.lock_outline,
                          size: 16,
                          color: Color(0xFFF87171),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'CARD SUSPENDED',
                          style: OnyxTypography.mono(
                            fontSize: 12,
                            color: const Color(0xFFFCA5A5),
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );

    if (onTap == null) return cardBody;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: cardBody,
    );
  }
}
