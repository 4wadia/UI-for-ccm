import { CardSupplier, IndianBank } from '../types';

export interface CardColorMatch {
  label: string;
  gradient: string;
  swatch: string;
  isLight: boolean;
  accentHex?: string;
}

export interface CardVariantPreset {
  name: string;
  defaultBrand: CardSupplier;
  color: CardColorMatch;
}

export const BANK_CARD_VARIANTS: Record<IndianBank, CardVariantPreset[]> = {
  'HDFC Bank': [
    {
      name: 'Regalia Gold',
      defaultBrand: 'visa',
      color: {
        label: 'Champagne Gold',
        gradient: 'bg-[#e5d2ad]',
        swatch: '#e5d2ad',
        isLight: true,
        accentHex: '#8a6814',
      },
    },
    {
      name: 'Infinia Metal',
      defaultBrand: 'visa',
      color: {
        label: 'Obsidian Gold',
        gradient: 'bg-[#15161a]',
        swatch: '#15161a',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Millennia',
      defaultBrand: 'mastercard',
      color: {
        label: 'Deep Cobalt',
        gradient: 'bg-[#1e355e]',
        swatch: '#1e355e',
        isLight: false,
      },
    },
    {
      name: 'Diners Club Black',
      defaultBrand: 'diners',
      color: {
        label: 'Jet Black',
        gradient: 'bg-[#121316]',
        swatch: '#121316',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Tata Neu Infinity',
      defaultBrand: 'rupay',
      color: {
        label: 'Royal Plum',
        gradient: 'bg-[#3c1942]',
        swatch: '#3c1942',
        isLight: false,
        accentHex: '#e2b874',
      },
    },
  ],
  'ICICI Bank': [
    {
      name: 'Amazon Pay',
      defaultBrand: 'visa',
      color: {
        label: 'Matte Charcoal',
        gradient: 'bg-[#1f2126]',
        swatch: '#1f2126',
        isLight: false,
        accentHex: '#f59e0b',
      },
    },
    {
      name: 'Sapphiro',
      defaultBrand: 'mastercard',
      color: {
        label: 'Sapphire Blue',
        gradient: 'bg-[#15345c]',
        swatch: '#15345c',
        isLight: false,
      },
    },
    {
      name: 'Emeralde Private',
      defaultBrand: 'mastercard',
      color: {
        label: 'Deep Emerald',
        gradient: 'bg-[#14332a]',
        swatch: '#14332a',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Coral',
      defaultBrand: 'rupay',
      color: {
        label: 'Coral Crimson',
        gradient: 'bg-[#8a2b2b]',
        swatch: '#8a2b2b',
        isLight: false,
      },
    },
    {
      name: 'Rubyx',
      defaultBrand: 'amex',
      color: {
        label: 'Ruby Garnet',
        gradient: 'bg-[#6e1828]',
        swatch: '#6e1828',
        isLight: false,
      },
    },
  ],
  'SBI Card': [
    {
      name: 'ELITE',
      defaultBrand: 'visa',
      color: {
        label: 'SBI Azure Navy',
        gradient: 'bg-[#173b70]',
        swatch: '#173b70',
        isLight: false,
      },
    },
    {
      name: 'Cashback',
      defaultBrand: 'visa',
      color: {
        label: 'Cobalt Indigo',
        gradient: 'bg-[#223466]',
        swatch: '#223466',
        isLight: false,
      },
    },
    {
      name: 'PRIME',
      defaultBrand: 'mastercard',
      color: {
        label: 'Graphite Slate',
        gradient: 'bg-[#23262e]',
        swatch: '#23262e',
        isLight: false,
      },
    },
    {
      name: 'AURUM',
      defaultBrand: 'visa',
      color: {
        label: 'Espresso Bronze',
        gradient: 'bg-[#261a14]',
        swatch: '#261a14',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'SimplyCLICK',
      defaultBrand: 'rupay',
      color: {
        label: 'Electric Blue',
        gradient: 'bg-[#1b4f8c]',
        swatch: '#1b4f8c',
        isLight: false,
      },
    },
  ],
  'Axis Bank': [
    {
      name: 'Atlas',
      defaultBrand: 'visa',
      color: {
        label: 'Axis Burgundy',
        gradient: 'bg-[#5e1633]',
        swatch: '#5e1633',
        isLight: false,
      },
    },
    {
      name: 'Magnus',
      defaultBrand: 'visa',
      color: {
        label: 'Imperial Maroon',
        gradient: 'bg-[#381426]',
        swatch: '#381426',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'ACE',
      defaultBrand: 'visa',
      color: {
        label: 'Onyx Slate',
        gradient: 'bg-[#1a1d24]',
        swatch: '#1a1d24',
        isLight: false,
      },
    },
    {
      name: 'Flipkart Axis',
      defaultBrand: 'visa',
      color: {
        label: 'Royal Cobalt',
        gradient: 'bg-[#183b75]',
        swatch: '#183b75',
        isLight: false,
      },
    },
    {
      name: 'Select',
      defaultBrand: 'mastercard',
      color: {
        label: 'Wine Velvet',
        gradient: 'bg-[#4f163b]',
        swatch: '#4f163b',
        isLight: false,
      },
    },
  ],
  'Kotak Mahindra Bank': [
    {
      name: 'White Reserve',
      defaultBrand: 'visa',
      color: {
        label: 'Pearl White',
        gradient: 'bg-[#f2f2f5]',
        swatch: '#f2f2f5',
        isLight: true,
      },
    },
    {
      name: 'Zen Signature',
      defaultBrand: 'visa',
      color: {
        label: 'Midnight Indigo',
        gradient: 'bg-[#1c2333]',
        swatch: '#1c2333',
        isLight: false,
      },
    },
    {
      name: 'Mojo Platinum',
      defaultBrand: 'mastercard',
      color: {
        label: 'Kotak Crimson',
        gradient: 'bg-[#7a1622]',
        swatch: '#7a1622',
        isLight: false,
      },
    },
    {
      name: 'League Platinum',
      defaultBrand: 'rupay',
      color: {
        label: 'Gunmetal',
        gradient: 'bg-[#262933]',
        swatch: '#262933',
        isLight: false,
      },
    },
  ],
  'IndusInd Bank': [
    {
      name: 'Pinnacle',
      defaultBrand: 'visa',
      color: {
        label: 'Deep Slate',
        gradient: 'bg-[#1a2230]',
        swatch: '#1a2230',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Legend',
      defaultBrand: 'visa',
      color: {
        label: 'IndusInd Maroon',
        gradient: 'bg-[#571c24]',
        swatch: '#571c24',
        isLight: false,
      },
    },
    {
      name: 'Tiger',
      defaultBrand: 'mastercard',
      color: {
        label: 'Amber Bronze',
        gradient: 'bg-[#332215]',
        swatch: '#332215',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'EazyDiner',
      defaultBrand: 'visa',
      color: {
        label: 'Terracotta Red',
        gradient: 'bg-[#6e241b]',
        swatch: '#6e241b',
        isLight: false,
      },
    },
  ],
  'Bank of Baroda': [
    {
      name: 'Eterna',
      defaultBrand: 'visa',
      color: {
        label: 'Baroda Vermilion',
        gradient: 'bg-[#9e3418]',
        swatch: '#9e3418',
        isLight: false,
      },
    },
    {
      name: 'Premier',
      defaultBrand: 'mastercard',
      color: {
        label: 'Sunset Copper',
        gradient: 'bg-[#b8491d]',
        swatch: '#b8491d',
        isLight: false,
      },
    },
    {
      name: 'Easy',
      defaultBrand: 'rupay',
      color: {
        label: 'Terracotta Orange',
        gradient: 'bg-[#c95322]',
        swatch: '#c95322',
        isLight: false,
      },
    },
  ],
  'Punjab National Bank': [
    {
      name: 'RuPay Select',
      defaultBrand: 'rupay',
      color: {
        label: 'PNB Maroon',
        gradient: 'bg-[#6b1929]',
        swatch: '#6b1929',
        isLight: false,
      },
    },
    {
      name: 'Platinum',
      defaultBrand: 'rupay',
      color: {
        label: 'Brushed Silver',
        gradient: 'bg-[#dce0e6]',
        swatch: '#dce0e6',
        isLight: true,
      },
    },
    {
      name: 'Raksha',
      defaultBrand: 'rupay',
      color: {
        label: 'Service Navy',
        gradient: 'bg-[#1b3554]',
        swatch: '#1b3554',
        isLight: false,
      },
    },
  ],
  'IDFC FIRST Bank': [
    {
      name: 'Wealth',
      defaultBrand: 'visa',
      color: {
        label: 'IDFC Ruby',
        gradient: 'bg-[#631422]',
        swatch: '#631422',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Select',
      defaultBrand: 'visa',
      color: {
        label: 'Prussian Blue',
        gradient: 'bg-[#1d2d44]',
        swatch: '#1d2d44',
        isLight: false,
      },
    },
    {
      name: 'Millennia',
      defaultBrand: 'visa',
      color: {
        label: 'Crimson Red',
        gradient: 'bg-[#751d2e]',
        swatch: '#751d2e',
        isLight: false,
      },
    },
    {
      name: 'FIRST Classic',
      defaultBrand: 'mastercard',
      color: {
        label: 'Steel Slate',
        gradient: 'bg-[#2b303a]',
        swatch: '#2b303a',
        isLight: false,
      },
    },
  ],
  'RBL Bank': [
    {
      name: 'World Safari',
      defaultBrand: 'mastercard',
      color: {
        label: 'Safari Navy',
        gradient: 'bg-[#1d344f]',
        swatch: '#1d344f',
        isLight: false,
      },
    },
    {
      name: 'Icon',
      defaultBrand: 'mastercard',
      color: {
        label: 'Carbon Black',
        gradient: 'bg-[#20232b]',
        swatch: '#20232b',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'ShopRite',
      defaultBrand: 'mastercard',
      color: {
        label: 'Indigo Blue',
        gradient: 'bg-[#22356b]',
        swatch: '#22356b',
        isLight: false,
      },
    },
  ],
  'Yes Bank': [
    {
      name: 'Marquee',
      defaultBrand: 'visa',
      color: {
        label: 'Yes Royal Navy',
        gradient: 'bg-[#14284b]',
        swatch: '#14284b',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Reserve',
      defaultBrand: 'mastercard',
      color: {
        label: 'Deep Midnight',
        gradient: 'bg-[#1b2234]',
        swatch: '#1b2234',
        isLight: false,
      },
    },
    {
      name: 'ACE',
      defaultBrand: 'rupay',
      color: {
        label: 'Sapphire Navy',
        gradient: 'bg-[#1d4278]',
        swatch: '#1d4278',
        isLight: false,
      },
    },
  ],
  'AU Small Finance Bank': [
    {
      name: 'Zenith+',
      defaultBrand: 'visa',
      color: {
        label: 'AU Royal Plum',
        gradient: 'bg-[#3c194d]',
        swatch: '#3c194d',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Vetta',
      defaultBrand: 'visa',
      color: {
        label: 'Velvet Purple',
        gradient: 'bg-[#522463]',
        swatch: '#522463',
        isLight: false,
      },
    },
    {
      name: 'LIT',
      defaultBrand: 'visa',
      color: {
        label: 'Copper Rust',
        gradient: 'bg-[#5c2b16]',
        swatch: '#5c2b16',
        isLight: false,
      },
    },
  ],
  'Federal Bank': [
    {
      name: 'Celesta',
      defaultBrand: 'visa',
      color: {
        label: 'Federal Navy',
        gradient: 'bg-[#17365d]',
        swatch: '#17365d',
        isLight: false,
        accentHex: '#d4af37',
      },
    },
    {
      name: 'Imperio',
      defaultBrand: 'mastercard',
      color: {
        label: 'Maritime Blue',
        gradient: 'bg-[#20426b]',
        swatch: '#20426b',
        isLight: false,
      },
    },
    {
      name: 'Signet',
      defaultBrand: 'rupay',
      color: {
        label: 'Slate Blue',
        gradient: 'bg-[#27384d]',
        swatch: '#27384d',
        isLight: false,
      },
    },
  ],
};

/**
 * Automatically detects the card network (Visa, Mastercard, RuPay, Amex, Diners)
 * by judging the leading BIN / IIN digits of the inserted card number.
 */
export function detectCardBrandFromNumber(rawNumber: string): CardSupplier | null {
  const digits = rawNumber.replace(/\D/g, '');
  if (!digits) return null;

  // American Express: 34, 37
  if (/^3[47]/.test(digits)) {
    return 'amex';
  }

  // Diners Club: 300-305, 36, 38, 39
  if (/^(30[0-5]|36|38|39)/.test(digits)) {
    return 'diners';
  }

  // RuPay (India): 60, 6521, 6522, 508, 81, 82 (checked before generic prefixes)
  if (/^(60|6521|6522|508|81|82)/.test(digits)) {
    return 'rupay';
  }

  // Visa: starts with 4
  if (/^4/.test(digits)) {
    return 'visa';
  }

  // Mastercard: 51-55 or 2221-2720
  if (/^5[1-5]/.test(digits)) {
    return 'mastercard';
  }
  if (digits.length >= 4) {
    const prefix4 = parseInt(digits.slice(0, 4), 10);
    if (prefix4 >= 2221 && prefix4 <= 2720) {
      return 'mastercard';
    }
  } else if (/^2[2-7]/.test(digits)) {
    return 'mastercard';
  }

  return null;
}

/**
 * Formats a raw card number string with spaces in 4-digit groups (or 4-6-5 for Amex).
 */
export function formatCardNumberInput(rawValue: string, detectedBrand: CardSupplier | null): string {
  const digits = rawValue.replace(/\D/g, '').slice(0, detectedBrand === 'amex' ? 15 : 16);
  if (detectedBrand === 'amex') {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 10);
    const p3 = digits.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(' ');
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Returns clean display name for the card variant without redundant bank prefixes.
 */
export function formatVariantLabel(bank: IndianBank, cardTier: string): string {
  const shortBank = bank.replace(' Mahindra Bank', '').replace(' Small Finance Bank', '').replace(' Bank', '').replace(' Card', '');
  const trimmed = cardTier.trim();
  const prefixes = [`${bank} `, `${shortBank} Card `, `${shortBank} `];
  for (const prefix of prefixes) {
    if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
      return trimmed.slice(prefix.length).trim();
    }
  }
  return trimmed;
}

/**
 * Fetches the authentic original flat card color based on the Issuing Bank & Card Variant.
 */
export function fetchOriginalCardColor(
  bank: IndianBank,
  cardTier: string,
  brand?: CardSupplier
): CardColorMatch {
  const tierLower = cardTier.toLowerCase();
  const bankPresets = BANK_CARD_VARIANTS[bank] || [];

  // 1. Exact or partial match from the bank's authentic card variant catalog
  const matchedPreset = bankPresets.find((preset) =>
    tierLower.includes(preset.name.toLowerCase())
  );
  if (matchedPreset) {
    return matchedPreset.color;
  }

  // 2. Fallback keyword matches
  if (tierLower.includes('regalia') || tierLower.includes('gold')) {
    return {
      label: 'Champagne Gold',
      gradient: 'bg-[#e5d2ad]',
      swatch: '#e5d2ad',
      isLight: true,
      accentHex: '#8a6814',
    };
  }
  if (tierLower.includes('white')) {
    return {
      label: 'Pearl White',
      gradient: 'bg-[#f2f2f5]',
      swatch: '#f2f2f5',
      isLight: true,
    };
  }
  if (tierLower.includes('infinia') || tierLower.includes('black') || tierLower.includes('reserve') || tierLower.includes('zenith')) {
    return {
      label: 'Obsidian Gold',
      gradient: 'bg-[#15161a]',
      swatch: '#15161a',
      isLight: false,
      accentHex: '#d4af37',
    };
  }
  if (tierLower.includes('amazon') || tierLower.includes('flipkart') || tierLower.includes('ace')) {
    return {
      label: 'Matte Charcoal',
      gradient: 'bg-[#1f2126]',
      swatch: '#1f2126',
      isLight: false,
    };
  }
  if (tierLower.includes('platinum') || tierLower.includes('silver') || tierLower.includes('titanium')) {
    return {
      label: 'Brushed Platinum',
      gradient: 'bg-[#e4e5ea]',
      swatch: '#e4e5ea',
      isLight: true,
    };
  }
  if (tierLower.includes('millennia') || tierLower.includes('coral') || tierLower.includes('rubyx')) {
    return {
      label: 'Crimson Slate',
      gradient: 'bg-[#6b1d2e]',
      swatch: '#6b1d2e',
      isLight: false,
    };
  }

  // 3. Default to the bank's primary signature preset if available
  if (bankPresets.length > 0) {
    return bankPresets[0].color;
  }

  if (brand === 'amex') {
    return {
      label: 'Silver Titanium',
      gradient: 'bg-[#e4e5ea]',
      swatch: '#e4e5ea',
      isLight: true,
    };
  }

  return {
    label: 'Warm Sand',
    gradient: 'bg-[#dfd3c3]',
    swatch: '#dfd3c3',
    isLight: true,
  };
}
