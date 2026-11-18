import 'package:flutter/material.dart';
import '../models/financial_models.dart';

class CardColorMatch {
  final String label;
  final Color color;
  final bool isLight;
  final Color? accentColor;

  const CardColorMatch({
    required this.label,
    required this.color,
    required this.isLight,
    this.accentColor,
  });
}

class CardVariantPreset {
  final String name;
  final CardSupplier defaultBrand;
  final CardColorMatch color;

  const CardVariantPreset({
    required this.name,
    required this.defaultBrand,
    required this.color,
  });
}

const Map<IndianBank, List<CardVariantPreset>> bankCardVariants = {
  IndianBank.hdfc: [
    CardVariantPreset(
      name: 'Regalia Gold',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Champagne Gold',
        color: Color(0xFFE5D2AD),
        isLight: true,
        accentColor: Color(0xFF8A6814),
      ),
    ),
    CardVariantPreset(
      name: 'Infinia Metal',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Obsidian Gold',
        color: Color(0xFF15161A),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Millennia',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Deep Cobalt',
        color: Color(0xFF1E355E),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Diners Club Black',
      defaultBrand: CardSupplier.diners,
      color: CardColorMatch(
        label: 'Jet Black',
        color: Color(0xFF121316),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Tata Neu Infinity',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Royal Plum',
        color: Color(0xFF3C1942),
        isLight: false,
        accentColor: Color(0xFFE2B874),
      ),
    ),
  ],
  IndianBank.icici: [
    CardVariantPreset(
      name: 'Amazon Pay',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Matte Charcoal',
        color: Color(0xFF1F2126),
        isLight: false,
        accentColor: Color(0xFFF59E0B),
      ),
    ),
    CardVariantPreset(
      name: 'Sapphiro',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Sapphire Blue',
        color: Color(0xFF15345C),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Emeralde Private',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Deep Emerald',
        color: Color(0xFF14332A),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Coral',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Coral Crimson',
        color: Color(0xFF8A2B2B),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Rubyx',
      defaultBrand: CardSupplier.amex,
      color: CardColorMatch(
        label: 'Ruby Garnet',
        color: Color(0xFF6E1828),
        isLight: false,
      ),
    ),
  ],
  IndianBank.sbi: [
    CardVariantPreset(
      name: 'ELITE',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'SBI Azure Navy',
        color: Color(0xFF173B70),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Cashback',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Cobalt Indigo',
        color: Color(0xFF223466),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'PRIME',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Graphite Slate',
        color: Color(0xFF23262E),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'AURUM',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Espresso Bronze',
        color: Color(0xFF261A14),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'SimplyCLICK',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Electric Blue',
        color: Color(0xFF1B4F8C),
        isLight: false,
      ),
    ),
  ],
  IndianBank.axis: [
    CardVariantPreset(
      name: 'Atlas',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Axis Burgundy',
        color: Color(0xFF5E1633),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Magnus',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Imperial Maroon',
        color: Color(0xFF381426),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'ACE',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Onyx Slate',
        color: Color(0xFF1A1D24),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Flipkart Axis',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Royal Cobalt',
        color: Color(0xFF183B75),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Select',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Wine Velvet',
        color: Color(0xFF4F163B),
        isLight: false,
      ),
    ),
  ],
  IndianBank.kotak: [
    CardVariantPreset(
      name: 'White Reserve',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Pearl White',
        color: Color(0xFFF2F2F5),
        isLight: true,
      ),
    ),
    CardVariantPreset(
      name: 'Zen Signature',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Midnight Indigo',
        color: Color(0xFF1C2333),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Mojo Platinum',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Kotak Crimson',
        color: Color(0xFF7A1622),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'League Platinum',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Gunmetal',
        color: Color(0xFF262933),
        isLight: false,
      ),
    ),
  ],
  IndianBank.indusInd: [
    CardVariantPreset(
      name: 'Pinnacle',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Deep Slate',
        color: Color(0xFF1A2230),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Legend',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'IndusInd Maroon',
        color: Color(0xFF571C24),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Tiger',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Amber Bronze',
        color: Color(0xFF332215),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'EazyDiner',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Terracotta Red',
        color: Color(0xFF6E241B),
        isLight: false,
      ),
    ),
  ],
  IndianBank.bob: [
    CardVariantPreset(
      name: 'Eterna',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Baroda Vermilion',
        color: Color(0xFF9E3418),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Premier',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Sunset Copper',
        color: Color(0xFFB8491D),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Easy',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Terracotta Orange',
        color: Color(0xFFC95322),
        isLight: false,
      ),
    ),
  ],
  IndianBank.pnb: [
    CardVariantPreset(
      name: 'RuPay Select',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'PNB Maroon',
        color: Color(0xFF6B1929),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Platinum',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Brushed Silver',
        color: Color(0xFFDCE0E6),
        isLight: true,
      ),
    ),
    CardVariantPreset(
      name: 'Raksha',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Service Navy',
        color: Color(0xFF1B3554),
        isLight: false,
      ),
    ),
  ],
  IndianBank.idfcFirst: [
    CardVariantPreset(
      name: 'Wealth',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'IDFC Ruby',
        color: Color(0xFF631422),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Select',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Prussian Blue',
        color: Color(0xFF1D2D44),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Millennia',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Crimson Red',
        color: Color(0xFF751D2E),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'FIRST Classic',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Steel Slate',
        color: Color(0xFF2B303A),
        isLight: false,
      ),
    ),
  ],
  IndianBank.rbl: [
    CardVariantPreset(
      name: 'World Safari',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Safari Navy',
        color: Color(0xFF1D344F),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Icon',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Carbon Black',
        color: Color(0xFF20232B),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'ShopRite',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Indigo Blue',
        color: Color(0xFF22356B),
        isLight: false,
      ),
    ),
  ],
  IndianBank.yesBank: [
    CardVariantPreset(
      name: 'Marquee',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Yes Royal Navy',
        color: Color(0xFF14284B),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Reserve',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Deep Midnight',
        color: Color(0xFF1B2234),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'ACE',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Sapphire Navy',
        color: Color(0xFF1D4278),
        isLight: false,
      ),
    ),
  ],
  IndianBank.auSmallFinance: [
    CardVariantPreset(
      name: 'Zenith+',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'AU Royal Plum',
        color: Color(0xFF3C194D),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Vetta',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Velvet Purple',
        color: Color(0xFF522463),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'LIT',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Copper Rust',
        color: Color(0xFF5C2B16),
        isLight: false,
      ),
    ),
  ],
  IndianBank.federal: [
    CardVariantPreset(
      name: 'Celesta',
      defaultBrand: CardSupplier.visa,
      color: CardColorMatch(
        label: 'Federal Navy',
        color: Color(0xFF17365D),
        isLight: false,
        accentColor: Color(0xFFD4AF37),
      ),
    ),
    CardVariantPreset(
      name: 'Imperio',
      defaultBrand: CardSupplier.mastercard,
      color: CardColorMatch(
        label: 'Maritime Blue',
        color: Color(0xFF20426B),
        isLight: false,
      ),
    ),
    CardVariantPreset(
      name: 'Signet',
      defaultBrand: CardSupplier.rupay,
      color: CardColorMatch(
        label: 'Slate Blue',
        color: Color(0xFF27384D),
        isLight: false,
      ),
    ),
  ],
};

/// Automatically detects card network (Visa, Mastercard, RuPay, Amex, Diners)
/// from leading BIN / IIN digits.
CardSupplier? detectCardBrandFromNumber(String rawNumber) {
  final digits = rawNumber.replaceAll(RegExp(r'\D'), '');
  if (digits.isEmpty) return null;

  if (RegExp(r'^3[47]').hasMatch(digits)) {
    return CardSupplier.amex;
  }
  if (RegExp(r'^(30[0-5]|36|38|39)').hasMatch(digits)) {
    return CardSupplier.diners;
  }
  if (RegExp(r'^(60|6521|6522|508|81|82)').hasMatch(digits)) {
    return CardSupplier.rupay;
  }
  if (digits.startsWith('4')) {
    return CardSupplier.visa;
  }
  if (RegExp(r'^5[1-5]').hasMatch(digits)) {
    return CardSupplier.mastercard;
  }
  if (digits.length >= 4) {
    final prefix4 = int.tryParse(digits.substring(0, 4)) ?? 0;
    if (prefix4 >= 2221 && prefix4 <= 2720) {
      return CardSupplier.mastercard;
    }
  } else if (RegExp(r'^2[2-7]').hasMatch(digits)) {
    return CardSupplier.mastercard;
  }
  return null;
}

/// Formats card digits into 4-digit groups (or 4-6-5 for American Express).
String formatCardNumberInput(String rawValue, CardSupplier? detectedBrand) {
  final maxLen = detectedBrand == CardSupplier.amex ? 15 : 16;
  var digits = rawValue.replaceAll(RegExp(r'\D'), '');
  if (digits.length > maxLen) {
    digits = digits.substring(0, maxLen);
  }

  if (detectedBrand == CardSupplier.amex) {
    final groups = <String>[];
    if (digits.isNotEmpty) {
      groups.add(digits.substring(0, digits.length.clamp(0, 4)));
    }
    if (digits.length > 4) {
      groups.add(digits.substring(4, digits.length.clamp(4, 10)));
    }
    if (digits.length > 10) {
      groups.add(digits.substring(10, digits.length.clamp(10, 15)));
    }
    return groups.join(' ');
  }

  final buffer = StringBuffer();
  for (int i = 0; i < digits.length; i++) {
    if (i > 0 && i % 4 == 0) buffer.write(' ');
    buffer.write(digits[i]);
  }
  return buffer.toString();
}

/// Clean card variant label without redundant bank name prefixes.
String formatVariantLabel(IndianBank bank, String cardTier) {
  final trimmed = cardTier.trim();
  final prefixes = [
    '${bank.displayName} ',
    '${bank.shortName} Card ',
    '${bank.shortName} ',
  ];
  for (final prefix in prefixes) {
    if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
      return trimmed.substring(prefix.length).trim();
    }
  }
  return trimmed;
}

/// Fetches the authentic original card color based on Issuing Bank & Variant.
CardColorMatch fetchOriginalCardColor(
  IndianBank bank,
  String cardTier, [
  CardSupplier? brand,
]) {
  final tierLower = cardTier.toLowerCase();
  final presets = bankCardVariants[bank] ?? const [];

  for (final preset in presets) {
    if (tierLower.contains(preset.name.toLowerCase())) {
      return preset.color;
    }
  }

  if (tierLower.contains('regalia') || tierLower.contains('gold')) {
    return const CardColorMatch(
      label: 'Champagne Gold',
      color: Color(0xFFE5D2AD),
      isLight: true,
      accentColor: Color(0xFF8A6814),
    );
  }
  if (tierLower.contains('white')) {
    return const CardColorMatch(
      label: 'Pearl White',
      color: Color(0xFFF2F2F5),
      isLight: true,
    );
  }
  if (tierLower.contains('infinia') ||
      tierLower.contains('black') ||
      tierLower.contains('reserve') ||
      tierLower.contains('zenith')) {
    return const CardColorMatch(
      label: 'Obsidian Gold',
      color: Color(0xFF15161A),
      isLight: false,
      accentColor: Color(0xFFD4AF37),
    );
  }
  if (tierLower.contains('amazon') ||
      tierLower.contains('flipkart') ||
      tierLower.contains('ace')) {
    return const CardColorMatch(
      label: 'Matte Charcoal',
      color: Color(0xFF1F2126),
      isLight: false,
    );
  }
  if (tierLower.contains('platinum') ||
      tierLower.contains('silver') ||
      tierLower.contains('titanium')) {
    return const CardColorMatch(
      label: 'Brushed Platinum',
      color: Color(0xFFE4E5EA),
      isLight: true,
    );
  }
  if (tierLower.contains('millennia') ||
      tierLower.contains('coral') ||
      tierLower.contains('rubyx')) {
    return const CardColorMatch(
      label: 'Crimson Slate',
      color: Color(0xFF6B1D2E),
      isLight: false,
    );
  }

  if (presets.isNotEmpty) {
    return presets.first.color;
  }

  if (brand == CardSupplier.amex) {
    return const CardColorMatch(
      label: 'Silver Titanium',
      color: Color(0xFFE4E5EA),
      isLight: true,
    );
  }

  return const CardColorMatch(
    label: 'Warm Sand',
    color: Color(0xFFDFD3C3),
    isLight: true,
  );
}
