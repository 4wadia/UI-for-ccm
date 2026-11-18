import React, { useState } from 'react';
import {
  ChevronLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CreditCard, Transaction } from '../../types';
import { formatINR } from '../../utils/formatCurrency';
import { fetchOriginalCardColor, formatVariantLabel } from '../../utils/cardHelpers';

interface ManageCardScreenProps {
  card: CreditCard;
  transactions?: Transaction[];
  onBack: () => void;
  isDarkMode?: boolean;
}

export const ManageCardScreen: React.FC<ManageCardScreenProps> = ({
  card,
  transactions = [],
  onBack,
  isDarkMode = true,
}) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const cardSpent = card.balance;
  const availableBalance = Math.max(0, card.limit - cardSpent);

  // Determine card earn type (Cashback vs Rewards Points) from card tier
  const tierLower = card.cardTier.toLowerCase();
  const isCashbackCard =
    tierLower.includes('amazon') ||
    tierLower.includes('millennia') ||
    tierLower.includes('cashback') ||
    tierLower.includes('flipkart') ||
    tierLower.includes('ace');

  const statementCashback = Math.max(120, Math.round(cardSpent * 0.025));
  const totalCashback = Math.max(1200, Math.round(cardSpent * 0.025 * 8.4));
  const statementPoints = Math.max(250, Math.round(cardSpent / 150) * 4);
  const totalPoints = Math.max(2400, Math.round(cardSpent / 150) * 38);

  const cardRecentTransactions = [
    {
      id: 'tx-starbucks',
      name: 'Starbucks Reserve',
      date: '21/11/26 · 08:32',
      amount: 480,
      status: 'Settled',
      iconBg: 'bg-[#006241]',
      iconChar: 'S',
    },
    {
      id: 'tx-swiggy',
      name: 'Swiggy Instamart',
      date: '20/11/26 · 19:14',
      amount: 1280,
      status: 'Settled',
      iconBg: 'bg-[#d4af37] text-[#111113]',
      iconChar: 'I',
    },
    {
      id: 'tx-netflix',
      name: 'Netflix India',
      date: '18/11/26 · 11:05',
      amount: 649,
      status: 'Settled',
      iconBg: 'bg-[#1c1d21]',
      iconChar: 'N',
    },
    ...transactions.map((tx) => ({
      id: tx.id,
      name: tx.title,
      date: tx.date,
      amount: tx.amount,
      status: tx.status === 'completed' ? 'Settled' : 'Pending',
      iconBg: 'bg-[#111113]',
      iconChar: tx.title.charAt(0).toUpperCase(),
    })),
  ];

  const initialCardTransactions = cardRecentTransactions.slice(0, 3);
  const extraCardTransactions = cardRecentTransactions.slice(3);

  const originalColor = fetchOriginalCardColor(
    card.bankName,
    card.cardTier,
    card.brand
  );
  const heroFinish = card.cardGradient || originalColor.gradient;
  const isLightHero =
    card.isLightCard !== undefined ? card.isLightCard : originalColor.isLight;
  const heroTextClass = isLightHero ? 'text-[#111113]' : 'text-[#f8f7f4]';
  const variantLabel = formatVariantLabel(card.bankName, card.cardTier);
  const boxSurfaceClass = isDarkMode
    ? 'bg-[#1c1c1f] text-[#f8f7f4]'
    : 'bg-[#ffffff] text-[#111113]';
  const boxMutedTextClass = isDarkMode ? 'text-[#f8f7f4]/55' : 'text-[#111113]/60';
  const boxPrimaryTextClass = isDarkMode ? 'text-[#f8f7f4]' : 'text-[#111113]';

  return (
    <div
      className={`flex-1 flex flex-col px-4 pt-2.5 pb-4 space-y-2 font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-[#000000] text-[#f8f7f4]' : 'bg-[#f8f7f4] text-[#111113]'
      }`}
    >
      {/* Top Navigation Bar */}
      <div className="relative flex items-center justify-center min-h-[36px]">
        <button
          onClick={onBack}
          className={`absolute left-0 w-9 h-9 rounded-full flex items-center justify-center shadow-none transition-colors cursor-pointer active:scale-95 ${
            isDarkMode
              ? 'bg-white/[0.04] hover:bg-white/10 text-[#f8f7f4]'
              : 'bg-white hover:bg-black/5 text-[#111113]'
          }`}
          aria-label="Back to cards"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
        </button>

        <h2 className="font-editorial text-xl font-semibold tracking-tight text-center">
          Manage Card
        </h2>
      </div>

      {/* Hero Physical Card */}
      <div
        className={`relative w-full rounded-[10px] p-4 aspect-[1.62/1] overflow-hidden flex flex-col justify-between select-none ${heroFinish}`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className={`flex items-center gap-1.5 font-semibold ${heroTextClass}`}>
            <span
              className="font-editorial italic text-lg font-bold"
              style={
                originalColor.accentHex
                  ? { color: originalColor.accentHex }
                  : undefined
              }
            >
              O
            </span>
            <span className="text-sm font-semibold tracking-tight">{card.bankName}</span>
          </div>
          <span className={`font-mono text-[9px] uppercase tracking-[0.12em] opacity-75 ${heroTextClass}`}>
            {variantLabel}
          </span>
        </div>

        <div className={`relative z-10 flex items-end justify-between ${heroTextClass}`}>
          <div>
            <span className="text-xs font-medium block">{card.holderName || 'Arjun Sharma'}</span>
            <span className="font-mono text-[11px] tracking-widest opacity-80 mt-0.5 block">
              •••• {card.maskedNumber ? card.maskedNumber.slice(-4) : '5168'}
            </span>
          </div>

          <div>
            {card.brand === 'rupay' ? (
              <span className={`text-sm font-bold tracking-tight ${heroTextClass}`}>RuPay</span>
            ) : card.brand === 'mastercard' ? (
              <div className="flex -space-x-1.5">
                <div className="w-4 h-4 rounded-full bg-[#eb001b] opacity-90" />
                <div className="w-4 h-4 rounded-full bg-[#f79e1b] opacity-90" />
              </div>
            ) : card.brand === 'amex' ? (
              <span className={`text-xs font-bold uppercase tracking-wider ${heroTextClass}`}>AMEX</span>
            ) : card.brand === 'diners' ? (
              <span className={`text-xs font-bold uppercase tracking-widest ${heroTextClass}`}>DINERS</span>
            ) : (
              <span className="text-base font-extrabold italic tracking-tighter">VISA</span>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Available Balance & Payment Due */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3.5 rounded-[10px] flex flex-col ${boxSurfaceClass}`}>
          <div className="flex items-center justify-between min-h-[24px]">
            <span className={`font-mono text-[9px] uppercase tracking-[0.1em] ${boxMutedTextClass}`}>
              Available
            </span>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className={`p-1 -mr-1 rounded-full transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-[#f8f7f4]/55 hover:text-[#d4af37]'
                  : 'text-[#111113]/55 hover:text-[#9a7b1c]'
              }`}
              aria-label="Toggle available balance visibility"
            >
              {balanceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="mt-2">
            <div className={`text-base font-bold leading-tight tracking-tight tabular-nums ${boxPrimaryTextClass}`}>
              {balanceVisible ? formatINR(availableBalance) : '••••••••'}
            </div>
            <span className={`font-mono text-[9px] block mt-1 tabular-nums ${boxMutedTextClass}`}>
              of {balanceVisible ? formatINR(card.limit, { compact: true }) : '••••'}
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-[10px] flex flex-col ${boxSurfaceClass}`}>
          <div className="flex items-center justify-between min-h-[24px]">
            <span className={`font-mono text-[9px] uppercase tracking-[0.1em] ${boxMutedTextClass}`}>
              Payment Due
            </span>
            <span
              className={`font-mono text-[9px] font-semibold ${
                isDarkMode ? 'text-[#d4af37]' : 'text-[#9a7b1c]'
              }`}
            >
              1 Oct
            </span>
          </div>

          <div className="mt-2">
            <span className={`text-base font-bold leading-tight tracking-tight tabular-nums block ${boxPrimaryTextClass}`}>
              {formatINR(cardSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Statement & Total Cashback / Rewards Points */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3 rounded-[10px] flex flex-col justify-between ${boxSurfaceClass}`}>
          <span className={`font-mono text-[9px] uppercase tracking-[0.1em] ${boxMutedTextClass}`}>
            {isCashbackCard ? 'Statement Cashback' : 'Statement Rewards'}
          </span>

          <div className="mt-2">
            <div className={`text-base font-bold tracking-tight tabular-nums ${boxPrimaryTextClass}`}>
              {isCashbackCard
                ? formatINR(statementCashback)
                : `${statementPoints.toLocaleString('en-IN')} pts`}
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-[10px] flex flex-col justify-between ${boxSurfaceClass}`}>
          <span className={`font-mono text-[9px] uppercase tracking-[0.1em] ${boxMutedTextClass}`}>
            {isCashbackCard ? 'Total Cashback' : 'Total Rewards'}
          </span>

          <div className="mt-2">
            <div className={`text-base font-bold tracking-tight tabular-nums ${boxPrimaryTextClass}`}>
              {isCashbackCard
                ? formatINR(totalCashback)
                : `${totalPoints.toLocaleString('en-IN')} pts`}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`p-3.5 rounded-[10px] space-y-2 ${boxSurfaceClass}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-semibold tracking-tight ${boxPrimaryTextClass}`}>
            Recent Transactions
          </h3>
          {extraCardTransactions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className={`font-mono text-[9px] uppercase tracking-[0.1em] transition-colors cursor-pointer active:scale-95 ${
                isDarkMode
                  ? 'text-[#f8f7f4]/65 hover:text-[#d4af37]'
                  : 'text-[#111113]/65 hover:text-[#111113]'
              }`}
            >
              {showAllTransactions ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>

        <div className="space-y-1">
          {initialCardTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-white ${
                    isDarkMode && (tx.iconBg === 'bg-[#1c1d21]' || tx.iconBg === 'bg-[#111113]')
                      ? 'bg-[#2c2c32]'
                      : tx.iconBg
                  }`}
                >
                  {tx.iconChar}
                </div>
                <div>
                  <h4 className={`text-xs font-medium leading-tight ${boxPrimaryTextClass}`}>
                    {tx.name}
                  </h4>
                  <span
                    className={`font-mono text-[9px] block mt-0.5 ${
                      isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
                    }`}
                  >
                    {tx.date}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-semibold tabular-nums block ${boxPrimaryTextClass}`}>
                  -{formatINR(tx.amount)}
                </span>
                <span
                  className={`font-mono text-[8px] uppercase tracking-wider ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}

          {extraCardTransactions.length > 0 && (
            <div
              className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                showAllTransactions
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0 pointer-events-none'
              }`}
            >
              <div className="overflow-hidden space-y-1">
                {extraCardTransactions.map((tx, idx) => (
                  <div
                    key={tx.id}
                    style={{
                      transitionDelay: showAllTransactions ? `${idx * 35}ms` : '0ms',
                    }}
                    className={`flex items-center justify-between py-1.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      showAllTransactions
                        ? 'translate-y-0 opacity-100'
                        : '-translate-y-1.5 opacity-0'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-white ${
                          isDarkMode && (tx.iconBg === 'bg-[#1c1d21]' || tx.iconBg === 'bg-[#111113]')
                            ? 'bg-[#2c2c32]'
                            : tx.iconBg
                        }`}
                      >
                        {tx.iconChar}
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium leading-tight ${boxPrimaryTextClass}`}>
                          {tx.name}
                        </h4>
                        <span
                          className={`font-mono text-[9px] block mt-0.5 ${
                            isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
                          }`}
                        >
                          {tx.date}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-semibold tabular-nums block ${boxPrimaryTextClass}`}>
                        -{formatINR(tx.amount)}
                      </span>
                      <span
                        className={`font-mono text-[8px] uppercase tracking-wider ${
                          isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
