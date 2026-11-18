import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { CreditCard, IndianBank, CardSupplier } from '../../types';
import {
  BANK_CARD_VARIANTS,
  detectCardBrandFromNumber,
  formatCardNumberInput,
  fetchOriginalCardColor,
} from '../../utils/cardHelpers';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: CreditCard) => void;
  isDarkMode?: boolean;
}

const INDIAN_BANKS: IndianBank[] = [
  'HDFC Bank',
  'ICICI Bank',
  'SBI Card',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'Bank of Baroda',
  'Punjab National Bank',
  'IDFC FIRST Bank',
  'RBL Bank',
  'Yes Bank',
  'AU Small Finance Bank',
  'Federal Bank',
];

const BRAND_LABELS: Record<CardSupplier, string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  rupay: 'RuPay',
  amex: 'AMEX',
  diners: 'Diners',
};

export const NewCardModal: React.FC<NewCardModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  isDarkMode = true,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<IndianBank>('HDFC Bank');
  const [selectedVariantName, setSelectedVariantName] = useState<string>(
    BANK_CARD_VARIANTS['HDFC Bank'][0].name
  );
  const [holderName, setHolderName] = useState('Arjun Sharma');
  const [creditLimit, setCreditLimit] = useState('300000');

  const bankVariants = useMemo(
    () => BANK_CARD_VARIANTS[selectedBank] || [],
    [selectedBank]
  );

  const selectedVariant = useMemo(
    () =>
      bankVariants.find((v) => v.name === selectedVariantName) ||
      bankVariants[0],
    [bankVariants, selectedVariantName]
  );

  const detectedBrand = useMemo(
    () => detectCardBrandFromNumber(cardNumber),
    [cardNumber]
  );

  const resolvedBrand: CardSupplier =
    detectedBrand || selectedVariant?.defaultBrand || 'visa';

  const originalColor = useMemo(
    () =>
      fetchOriginalCardColor(
        selectedBank,
        selectedVariant?.name || '',
        resolvedBrand
      ),
    [selectedBank, selectedVariant, resolvedBrand]
  );

  if (!isOpen) return null;

  const handleBankChange = (bank: IndianBank) => {
    setSelectedBank(bank);
    const firstVariant = BANK_CARD_VARIANTS[bank]?.[0];
    if (firstVariant) {
      setSelectedVariantName(firstVariant.name);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const brand = detectCardBrandFromNumber(raw);
    setCardNumber(formatCardNumberInput(raw, brand));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cardNumber.replace(/\D/g, '');
    const last4 =
      digits.length >= 4
        ? digits.slice(-4)
        : Math.floor(1000 + Math.random() * 9000).toString();
    const prefix =
      resolvedBrand === 'visa'
        ? '4532'
        : resolvedBrand === 'mastercard'
        ? '5421'
        : resolvedBrand === 'rupay'
        ? '6521'
        : resolvedBrand === 'diners'
        ? '3612'
        : '3742';

    const cleanNumber =
      digits.length >= 12
        ? formatCardNumberInput(digits, resolvedBrand)
        : `${prefix} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(
            1000 + Math.random() * 9000
          )} ${last4}`;

    const numericLimit = Math.max(10000, Number(creditLimit) || 300000);
    const variantLabel = selectedVariant?.name || 'Classic';

    const newCard: CreditCard = {
      id: `card-${Date.now()}`,
      bankName: selectedBank,
      holderName: holderName.trim() || 'Arjun Sharma',
      cardNumber: cleanNumber,
      maskedNumber: `•••• ${last4}`,
      expiry: '09/30',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      balance: 0,
      limit: numericLimit,
      brand: resolvedBrand,
      cardTier: `${selectedBank.replace(' Bank', '')} ${variantLabel}`,
      theme: originalColor.isLight ? 'cream' : 'obsidian',
      cardGradient: originalColor.gradient,
      isLightCard: originalColor.isLight,
      isFrozen: false,
      dailyLimit: Math.round(numericLimit * 0.25),
      currentDailySpent: 0,
      contactlessEnabled: true,
      onlinePaymentsEnabled: true,
      internationalEnabled: resolvedBrand !== 'rupay',
    };

    onAddCard(newCard);
    setCardNumber('');
    onClose();
  };

  const inputClass = `w-full text-xs rounded-[12px] px-3 py-2.5 border focus:outline-none transition-colors ${
    isDarkMode
      ? 'bg-[#000000] text-[#f8f7f4] border-[rgba(248,247,244,0.12)] focus:border-[#d4af37] placeholder:text-[#f8f7f4]/35'
      : 'bg-[#ffffff] text-[#111113] border-[#111113]/15 focus:border-[#9a7b1c] placeholder:text-[#111113]/40'
  }`;

  const labelClass = `font-mono text-[10px] uppercase tracking-[0.1em] block mb-1.5 ${
    isDarkMode ? 'text-[#f8f7f4]/55' : 'text-[#111113]/60'
  }`;

  const previewTextColor = originalColor.isLight
    ? 'text-[#111113]'
    : 'text-[#f8f7f4]';
  const digits = cardNumber.replace(/\D/g, '');
  const previewLast4 = digits.length >= 4 ? digits.slice(-4) : '8824';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative z-10 w-full max-w-[390px] max-h-[92vh] overflow-y-auto hide-scrollbar rounded-[20px] p-5 border transition-colors ${
          isDarkMode
            ? 'bg-[#1c1c1f] border-[rgba(248,247,244,0.14)] text-[#f8f7f4]'
            : 'bg-[#f8f7f4] border-[#111113]/15 text-[#111113]'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3.5 mb-4 border-b ${
            isDarkMode
              ? 'border-[rgba(248,247,244,0.1)]'
              : 'border-[#111113]/10'
          }`}
        >
          <div>
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.12em] block ${
                isDarkMode ? 'text-[#d4af37]' : 'text-[#9a7b1c]'
              }`}
            >
              New Portfolio Instrument
            </span>
            <h3 className="font-editorial text-2xl font-semibold tracking-tight leading-tight">
              Issue Card
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-[rgba(248,247,244,0.12)] hover:border-[#d4af37] text-[#f8f7f4]/70 hover:text-[#f8f7f4]'
                : 'border-[#111113]/15 hover:border-[#111113] text-[#111113]/70 hover:text-[#111113]'
            }`}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Original Card Color & Design Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.1em] ${
                isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'
              }`}
            >
              Original Design
            </span>
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.1em] ${
                isDarkMode ? 'text-[#d4af37]' : 'text-[#9a7b1c]'
              }`}
            >
              {originalColor.label}
            </span>
          </div>

          <div
            className={`w-full rounded-[10px] p-3.5 h-[112px] flex flex-col justify-between select-none transition-colors duration-200 ${originalColor.gradient} ${previewTextColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold tracking-tight">
                <span
                  className="font-editorial italic text-base font-bold"
                  style={
                    originalColor.accentHex
                      ? { color: originalColor.accentHex }
                      : undefined
                  }
                >
                  O
                </span>
                <span className="text-xs font-semibold tracking-tight">
                  {selectedBank}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-75">
                {selectedVariant?.name}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] font-medium block">
                  {holderName.trim() || 'Arjun Sharma'}
                </span>
                <span className="font-mono text-[10px] tracking-widest opacity-75 block">
                  •••• {previewLast4}
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                {BRAND_LABELS[resolvedBrand]}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Card Number with automatic BIN network detection */}
          <div>
            <label className={labelClass}>Card Number</label>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4532 •••• •••• ••••"
                className={`${inputClass} pr-24 tabular-nums tracking-wider font-mono`}
                required
              />
              <span
                className={`absolute right-2.5 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-sm ${
                  detectedBrand
                    ? isDarkMode
                      ? 'bg-[#d4af37] text-[#111113] font-semibold'
                      : 'bg-[#111113] text-[#f8f7f4] font-semibold'
                    : isDarkMode
                    ? 'text-[#f8f7f4]/55'
                    : 'text-[#111113]/55'
                }`}
              >
                {BRAND_LABELS[resolvedBrand]}
              </span>
            </div>
          </div>

          {/* Bank & Card Variant (Selection Lists Only) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Issuing Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => handleBankChange(e.target.value as IndianBank)}
                className={`${inputClass} cursor-pointer`}
              >
                {INDIAN_BANKS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Card Variant</label>
              <select
                value={selectedVariant?.name || ''}
                onChange={(e) => setSelectedVariantName(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {bankVariants.map((variant) => (
                  <option key={variant.name} value={variant.name}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cardholder & Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Cardholder</label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Arjun Sharma"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Limit (₹)</label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                placeholder="300000"
                className={`${inputClass} tabular-nums font-mono`}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-full font-semibold text-xs transition-opacity hover:opacity-90 active:scale-[0.99] cursor-pointer ${
              isDarkMode
                ? 'bg-[#d4af37] text-[#111113]'
                : 'bg-[#111113] text-[#f8f7f4]'
            }`}
          >
            + Issue Card
          </button>
        </form>
      </div>
    </div>
  );
};
