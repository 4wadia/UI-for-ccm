import React from 'react';
import { Plus, Lock } from 'lucide-react';
import { CreditCard } from '../../types';
import { fetchOriginalCardColor, formatVariantLabel } from '../../utils/cardHelpers';

interface CardsScreenProps {
  cards: CreditCard[];
  onOpenNewCardModal: () => void;
  onSelectCard?: (card: CreditCard) => void;
  isDarkMode?: boolean;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({
  cards,
  onOpenNewCardModal,
  onSelectCard = () => {},
  isDarkMode = true,
}) => {
  const renderCardSupplier = (brand: string, isLight: boolean) => {
    const textColor = isLight ? 'text-[#111113]' : 'text-[#f8f7f4]';
    switch (brand) {
      case 'rupay':
        return (
          <span className={`text-sm font-bold tracking-tight ${textColor}`}>
            RuPay
          </span>
        );
      case 'visa':
        return (
          <span className={`text-base font-extrabold italic tracking-tighter ${textColor}`}>
            VISA
          </span>
        );
      case 'mastercard':
        return (
          <div className="flex -space-x-1.5">
            <div className="w-4 h-4 rounded-full bg-[#eb001b] opacity-90" />
            <div className="w-4 h-4 rounded-full bg-[#f79e1b] opacity-90" />
          </div>
        );
      case 'amex':
        return (
          <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
            AMEX
          </span>
        );
      case 'diners':
        return (
          <span className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>
            DINERS
          </span>
        );
      default:
        return <span className={`text-xs font-bold uppercase ${textColor}`}>{brand}</span>;
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col px-5 pt-3 pb-16 space-y-4 font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-[#000000] text-[#f8f7f4]' : 'bg-[#f8f7f4] text-[#111113]'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] block ${
              isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
            }`}
          >
            {cards.length} Active Cards
          </span>
          <h2 className="font-editorial text-2xl font-semibold tracking-tight leading-tight">
            Your Cards
          </h2>
        </div>

        <button
          onClick={onOpenNewCardModal}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-xs transition-opacity hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
            isDarkMode
              ? 'bg-[#d4af37] text-[#111113]'
              : 'bg-[#111113] text-[#f8f7f4]'
          }`}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Card</span>
        </button>
      </div>

      {/* Vertical Card Portfolio Stack (Tight, Borderless, Less Rounded) */}
      <div className="space-y-3">
        {cards.map((card) => {
          const originalColor = fetchOriginalCardColor(
            card.bankName,
            card.cardTier,
            card.brand
          );
          const cardFinish = card.cardGradient || originalColor.gradient;
          const isLight =
            card.isLightCard !== undefined ? card.isLightCard : originalColor.isLight;
          const variantLabel = formatVariantLabel(card.bankName, card.cardTier);

          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              className="group cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99]"
            >
              {/* Physical Card Container with Less Rounded Corners & No Border */}
              <div
                className={`relative w-full rounded-[10px] p-4 aspect-[1.62/1] overflow-hidden flex flex-col justify-between select-none ${
                  card.isFrozen
                    ? 'bg-[#18181b] text-[#f8f7f4]'
                    : `${cardFinish} ${isLight ? 'text-[#111113]' : 'text-[#f8f7f4]'}`
                }`}
              >
                {/* Top Row */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold tracking-tight">
                    <span
                      className="font-editorial italic text-lg font-bold"
                      style={
                        !card.isFrozen && originalColor.accentHex
                          ? { color: originalColor.accentHex }
                          : undefined
                      }
                    >
                      O
                    </span>
                    <span className="text-sm font-semibold tracking-tight">{card.bankName}</span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-75">
                    {variantLabel}
                  </span>
                </div>

                {/* Bottom Row */}
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <span className="text-xs font-medium block tracking-normal">
                      {card.holderName || 'Arjun Sharma'}
                    </span>
                    <span className="font-mono text-[11px] tracking-widest opacity-75 mt-0.5 block">
                      •••• {card.maskedNumber ? card.maskedNumber.slice(-4) : '5168'}
                    </span>
                  </div>

                  <div>{renderCardSupplier(card.brand, isLight)}</div>
                </div>

                {/* Suspended Overlay */}
                {card.isFrozen && (
                  <div className="absolute inset-0 bg-black/85 flex items-center justify-center gap-2 text-white">
                    <Lock className="w-4 h-4 text-red-400" />
                    <span className="font-mono text-xs uppercase tracking-wider text-red-300">
                      Card Suspended
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
