import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { CreditCard, Transaction } from '../../types';
import { formatINR } from '../../utils/formatCurrency';

interface HomeScreenProps {
  cards: CreditCard[];
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenNewCardModal: () => void;
  onNavigateToCards?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  cards,
  transactions,
  onSelectTransaction,
  isDarkMode = true,
  onToggleDarkMode,
}) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [themePulseKey, setThemePulseKey] = useState(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const themeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showSearch) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showSearch]);

  useEffect(() => {
    return () => {
      if (themeTimerRef.current) clearTimeout(themeTimerRef.current);
    };
  }, []);

  const handleToggleTheme = () => {
    onToggleDarkMode?.();
    setThemePulseKey((k) => k + 1);
    setThemeExpanded(true);
    if (themeTimerRef.current) clearTimeout(themeTimerRef.current);
    themeTimerRef.current = setTimeout(() => {
      setThemeExpanded(false);
    }, 1300);
  };

  // Consolidated Portfolio Metrics across all Indian Bank Cards
  const totalCombinedLimit = cards.reduce((sum, c) => sum + (c.limit || 0), 0);
  const totalCombinedSpend = cards.reduce((sum, c) => sum + (c.balance || 0), 0);
  const utilizationPercent =
    totalCombinedLimit > 0 ? Math.min(100, Math.round((totalCombinedSpend / totalCombinedLimit) * 100)) : 0;

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery) return true;
    return (
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.cardBank && tx.cardBank.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const initialTransactions = filteredTransactions.slice(0, 4);
  const extraTransactions = filteredTransactions.slice(4);

  const goldText = isDarkMode ? 'text-[#d4af37]' : 'text-[#9a7b1c]';
  const goldBorder = isDarkMode ? 'border-[#d4af37]' : 'border-[#9a7b1c]';
  const goldBg = isDarkMode ? 'bg-[#d4af37]' : 'bg-[#9a7b1c]';

  return (
    <div
      className={`flex-1 flex flex-col px-4 pt-2.5 pb-16 space-y-4 font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-[#000000] text-[#f8f7f4]' : 'bg-[#f8f7f4] text-[#111113]'
      }`}
    >
      {/* Top User Row with Inline Self-Expanding Search & Dark/Light Toggle */}
      <div className="relative h-9 flex items-center justify-end">
        {/* Left Avatar + Name (fades smoothly as Search expands from itself) */}
        <div
          className={`absolute left-0 flex items-center gap-3 min-w-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showSearch
              ? 'opacity-0 -translate-x-2 scale-95 pointer-events-none'
              : 'opacity-100 translate-x-0 scale-100'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full border ${goldBorder} flex items-center justify-center text-[11px] font-mono tracking-wider shrink-0`}
          >
            AS
          </div>
          <span className="text-[14px] font-medium tracking-tight truncate">
            Arjun Sharma
          </span>
        </div>

        {/* Right Controls: Self-Expanding Search Pill, Self-Expanding Theme Toggle, Bell */}
        <div
          className={`relative z-10 flex items-center justify-end w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showSearch ? 'gap-0' : 'gap-1'
          }`}
        >
          {/* Search Pill: expands horizontally from its own 36px circle into full header search bar */}
          <div
            className={`h-9 rounded-full flex items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showSearch
                ? isDarkMode
                  ? 'w-full max-w-[360px] bg-[#1c1c1f] px-3 gap-2 border border-[rgba(248,247,244,0.14)]'
                  : 'w-full max-w-[360px] bg-white px-3 gap-2 border border-[#111113]/15'
                : isDarkMode
                ? 'w-full max-w-[36px] justify-center hover:bg-white/10'
                : 'w-full max-w-[36px] justify-center hover:bg-black/5'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (!showSearch) {
                  setShowSearch(true);
                  setNotificationOpen(false);
                } else {
                  searchInputRef.current?.focus();
                }
              }}
              aria-label="Open search"
              className={`shrink-0 flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                showSearch
                  ? isDarkMode
                    ? 'text-[#d4af37]'
                    : 'text-[#9a7b1c]'
                  : isDarkMode
                  ? 'w-9 h-9 text-[#f8f7f4]/60 hover:text-[#f8f7f4]'
                  : 'w-9 h-9 text-[#111113]/60 hover:text-[#111113]'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search merchant, bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              tabIndex={showSearch ? 0 : -1}
              className={`min-w-0 bg-transparent text-xs focus:outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                showSearch
                  ? isDarkMode
                    ? 'flex-1 opacity-100 text-[#f8f7f4] placeholder:text-[#f8f7f4]/40'
                    : 'flex-1 opacity-100 text-[#111113] placeholder:text-[#111113]/40'
                  : 'w-0 opacity-0 pointer-events-none p-0'
              }`}
            />

            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              tabIndex={showSearch ? 0 : -1}
              aria-label="Close search"
              className={`shrink-0 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                showSearch
                  ? isDarkMode
                    ? 'w-6 h-6 opacity-100 scale-100 text-[#f8f7f4]/60 hover:text-[#f8f7f4] hover:bg-white/10'
                    : 'w-6 h-6 opacity-100 scale-100 text-[#111113]/60 hover:text-[#111113] hover:bg-black/5'
                  : 'w-0 h-0 opacity-0 scale-50 pointer-events-none overflow-hidden'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dark / Light Mode Toggle: expands from itself into pill + ripple on click */}
          <div
            className={`relative shrink-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showSearch
                ? 'max-w-0 opacity-0 scale-75 overflow-hidden pointer-events-none'
                : themeExpanded
                ? 'max-w-[84px] opacity-100 scale-100'
                : 'max-w-[36px] opacity-100 scale-100'
            }`}
          >
            {themePulseKey > 0 && (
              <span
                key={themePulseKey}
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 rounded-full animate-expand-ripple ${
                  isDarkMode
                    ? 'border border-[#d4af37]/60 bg-[#d4af37]/15'
                    : 'border border-[#9a7b1c]/60 bg-[#9a7b1c]/15'
                }`}
              />
            )}

            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`relative z-10 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer active:scale-95 ${
                themeExpanded ? 'px-3 gap-1.5 w-full' : 'w-9 px-0 gap-0'
              } ${
                isDarkMode
                  ? themeExpanded
                    ? 'bg-[#1c1c1f] text-[#d4af37]'
                    : 'text-[#f8f7f4]/60 hover:text-[#f8f7f4] hover:bg-white/10'
                  : themeExpanded
                  ? 'bg-white text-[#9a7b1c]'
                  : 'text-[#111113]/60 hover:text-[#111113] hover:bg-black/5'
              }`}
            >
              <span className="relative w-4 h-4 flex items-center justify-center shrink-0">
                <Sun
                  className={`w-4 h-4 absolute transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDarkMode
                      ? 'opacity-0 rotate-90 scale-50'
                      : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
                <Moon
                  className={`w-4 h-4 absolute transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDarkMode
                      ? 'opacity-100 rotate-0 scale-100'
                      : 'opacity-0 -rotate-90 scale-50'
                  }`}
                />
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.08em] whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  themeExpanded ? 'max-w-[42px] opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                {isDarkMode ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>

          {/* Bell Notification Button */}
          <div
            className={`relative shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showSearch
                ? 'max-w-0 opacity-0 scale-75 overflow-hidden pointer-events-none'
                : 'max-w-[36px] opacity-100 scale-100'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setShowSearch(false);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode
                  ? notificationOpen
                    ? 'text-[#d4af37] bg-white/10'
                    : 'text-[#f8f7f4]/50 hover:text-[#f8f7f4]'
                  : notificationOpen
                  ? 'text-[#9a7b1c] bg-black/5'
                  : 'text-[#111113]/50 hover:text-[#111113]'
              }`}
              aria-label="Portfolio alerts"
            >
              <Bell className="w-4 h-4" />
            </button>

            {notificationOpen && (
              <div
                className={`absolute right-0 top-11 w-64 p-3.5 rounded-[16px] z-50 border ${
                  isDarkMode
                    ? 'bg-[#1c1c1f] border-[rgba(248,247,244,0.14)] text-[#f8f7f4]'
                    : 'bg-[#ffffff] border-[#111113]/15 text-[#111113]'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-2 mb-2.5 border-b ${
                    isDarkMode ? 'border-white/10' : 'border-black/10'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    Portfolio Alerts
                  </span>
                  <span className={`font-mono text-[10px] ${goldText}`}>Verified</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${goldText}`} />
                    <div>
                      <p className="font-medium text-[11px]">RBI Tokenization Active</p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'
                        }`}
                      >
                        Credentials verified across {cards.length} Indian banks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centered Editorial Stat Block (Cormorant Garamond Hero Figure + Gold Utilization Bar) */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center justify-center gap-2">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
              isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'
            }`}
          >
            Total Month Spend
          </span>
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-[#f8f7f4]/45 hover:text-[#d4af37]'
                : 'text-[#111113]/45 hover:text-[#9a7b1c]'
            }`}
            aria-label="Toggle spend visibility"
          >
            {balanceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        <h1 className="font-editorial text-[52px] leading-none font-semibold tracking-tight tabular-nums mt-2">
          {balanceVisible ? formatINR(totalCombinedSpend) : '••••••••'}
        </h1>

        {/* 4px Utilization Progress Track */}
        <div
          className={`w-full h-1 rounded-xs overflow-hidden mt-5 ${
            isDarkMode ? 'bg-white/10' : 'bg-black/10'
          }`}
        >
          <div
            className={`h-full transition-all duration-300 ${goldBg}`}
            style={{ width: `${utilizationPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] ${
              isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'
            }`}
          >
            Limit Used
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums">
            {utilizationPercent}% of {balanceVisible ? formatINR(totalCombinedLimit, { compact: true }) : '••••'}
          </span>
        </div>
      </div>

      {/* Recent Activity Card (Borderless, tighter spacing) */}
      <div
        className={`rounded-[12px] p-4 ${
          isDarkMode ? 'bg-[#1c1c1f]' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold tracking-tight">Recent Activity</h3>
          {extraTransactions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className={`font-mono text-[10px] uppercase tracking-[0.1em] transition-colors cursor-pointer active:scale-95 ${
                isDarkMode
                  ? 'text-[#f8f7f4]/55 hover:text-[#d4af37]'
                  : 'text-[#111113]/55 hover:text-[#9a7b1c]'
              }`}
            >
              {showAllTransactions ? 'Less' : 'View all'}
            </button>
          )}
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-6 text-center">
            <p
              className={`text-xs ${
                isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
              }`}
            >
              No matching transactions found.
            </p>
          </div>
        ) : (
          <div>
            {initialTransactions.map((tx) => (
              <button
                type="button"
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className={`w-full flex items-center justify-between py-2.5 text-left transition-colors cursor-pointer ${
                  isDarkMode ? 'hover:text-[#d4af37]' : 'hover:text-[#9a7b1c]'
                }`}
              >
                <div className="min-w-0 pr-3">
                  <span className="text-[12px] font-medium block truncate">
                    {tx.title}
                  </span>
                  <span
                    className={`font-mono text-[9px] tracking-[0.06em] block mt-0.5 ${
                      isDarkMode ? 'text-[#f8f7f4]/45' : 'text-[#111113]/50'
                    }`}
                  >
                    {tx.cardBank || 'Card'} · {tx.date}
                  </span>
                </div>

                <span className="text-[12px] font-semibold tabular-nums shrink-0">
                  {tx.type === 'income' ? '+' : '-'}
                  {balanceVisible ? formatINR(tx.amount) : '••••'}
                </span>
              </button>
            ))}

            {extraTransactions.length > 0 && (
              <div
                className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  showAllTransactions
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  {extraTransactions.map((tx, idx) => (
                    <button
                      type="button"
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      tabIndex={showAllTransactions ? 0 : -1}
                      style={{
                        transitionDelay: showAllTransactions ? `${idx * 35}ms` : '0ms',
                      }}
                      className={`w-full flex items-center justify-between py-2.5 text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                        showAllTransactions
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-1.5 opacity-0'
                      } ${isDarkMode ? 'hover:text-[#d4af37]' : 'hover:text-[#9a7b1c]'}`}
                    >
                      <div className="min-w-0 pr-3">
                        <span className="text-[12px] font-medium block truncate">
                          {tx.title}
                        </span>
                        <span
                          className={`font-mono text-[9px] tracking-[0.06em] block mt-0.5 ${
                            isDarkMode ? 'text-[#f8f7f4]/45' : 'text-[#111113]/50'
                          }`}
                        >
                          {tx.cardBank || 'Card'} · {tx.date}
                        </span>
                      </div>

                      <span className="text-[12px] font-semibold tabular-nums shrink-0">
                        {tx.type === 'income' ? '+' : '-'}
                        {balanceVisible ? formatINR(tx.amount) : '••••'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
