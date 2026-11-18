import React from 'react';
import { Maximize2, ArrowRight } from 'lucide-react';
import { CategoryBudget, CreditCard, ScreenId, Transaction } from '../../types';
import { HomeScreen } from '../screens/HomeScreen';
import { CardsScreen } from '../screens/CardsScreen';
import { ManageCardScreen } from '../screens/ManageCardScreen';

interface ArtboardShowcaseProps {
  cards: CreditCard[];
  transactions: Transaction[];
  categories: CategoryBudget[];
  onSelectScreenToEmulate: (tab: ScreenId) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onToggleFreeze: (cardId: string) => void;
  onUpdateLimit: (cardId: string, limit: number) => void;
  onToggleContactless: (cardId: string) => void;
  onToggleOnline: (cardId: string) => void;
  onOpenNewCardModal: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const ArtboardShowcase: React.FC<ArtboardShowcaseProps> = ({
  cards,
  transactions,
  onSelectScreenToEmulate,
  onSelectTransaction,
  onOpenNewCardModal,
  isDarkMode = true,
  onToggleDarkMode,
}) => {
  const screens = [
    {
      id: 'home' as ScreenId,
      number: '01',
      title: 'Combined Credit Portfolio',
      description:
        'Consolidated Indian credit limit, editorial spend headline in INR (₹), utilization bar, and settled authorizations.',
      component: (
        <HomeScreen
          cards={cards}
          transactions={transactions}
          onSelectTransaction={onSelectTransaction}
          onOpenNewCardModal={onOpenNewCardModal}
          onNavigateToCards={() => onSelectScreenToEmulate('cards')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      ),
    },
    {
      id: 'cards' as ScreenId,
      number: '02',
      title: 'Vertical Card Stack',
      description:
        'ISO 18px card proportions featuring RuPay, Visa, and Mastercard finishes with quick credit availability strips.',
      component: (
        <CardsScreen
          cards={cards}
          onOpenNewCardModal={onOpenNewCardModal}
          onSelectCard={() => onSelectScreenToEmulate('cards')}
          isDarkMode={isDarkMode}
        />
      ),
    },
    {
      id: 'cards' as ScreenId,
      number: '03',
      title: 'Manage Card & Analytics',
      description:
        'Interactive monthly spending distribution, available balance toggle, early bill payment, and merchant ledger.',
      component: (
        <ManageCardScreen
          card={cards[0]}
          transactions={transactions}
          onBack={() => onSelectScreenToEmulate('cards')}
          isDarkMode={isDarkMode}
        />
      ),
    },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-10 space-y-12 font-sans">
      {/* Showcase Header */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b ${
          isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10'
        }`}
      >
        <div>
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.14em] block mb-2 ${
              isDarkMode ? 'text-[#d4af37]' : 'text-[#9a7b1c]'
            }`}
          >
            Editorial Canvas · 3 Core Screens
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold tracking-tight">
            Onyx Portfolio Architecture
          </h1>
          <p
            className={`text-sm mt-1.5 max-w-2xl ${
              isDarkMode ? 'text-[#f8f7f4]/60' : 'text-[#111113]/65'
            }`}
          >
            Deep obsidian (<code className="font-mono">#111113</code>), warm ivory (<code className="font-mono">#f8f7f4</code>), and brushed gold (<code className="font-mono">#d4af37</code>) across all mobile screens.
          </p>
        </div>

        <span
          className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
            isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'
          }`}
        >
          Click any artboard to inspect live
        </span>
      </div>

      {/* 3-Screen Artboards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {screens.map((screen) => (
          <div key={`${screen.id}-${screen.number}`} className="flex flex-col space-y-3 group">
            <div className="flex items-center justify-between px-1">
              <div>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.14em] block ${
                    isDarkMode ? 'text-[#d4af37]' : 'text-[#9a7b1c]'
                  }`}
                >
                  Artboard {screen.number}
                </span>
                <h3 className="text-sm font-semibold tracking-tight">{screen.title}</h3>
              </div>
              <button
                onClick={() => onSelectScreenToEmulate(screen.id)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#d4af37] text-[#111113]'
                    : 'bg-[#111113] text-[#f8f7f4]'
                }`}
              >
                <span>Open</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div
              onClick={() => onSelectScreenToEmulate(screen.id)}
              className={`relative w-full h-[640px] rounded-[40px] border transition-colors duration-200 overflow-hidden cursor-pointer flex flex-col ${
                isDarkMode
                  ? 'bg-[#000000] border-[rgba(248,247,244,0.14)] group-hover:border-[#d4af37]'
                  : 'bg-[#f8f7f4] border-[#111113]/15 group-hover:border-[#111113]'
              }`}
            >
              <div
                className={`h-8 px-6 pt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] shrink-0 ${
                  isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
                }`}
              >
                <span>9:41</span>
                <div
                  className={`w-12 h-3 rounded-full ${
                    isDarkMode ? 'bg-white/10' : 'bg-black/10'
                  }`}
                />
                <span>LTE</span>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
                {screen.component}
              </div>

              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                <div
                  className={`text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 border ${
                    isDarkMode
                      ? 'bg-[#111113] text-[#f8f7f4] border-[#d4af37]'
                      : 'bg-[#111113] text-[#f8f7f4] border-[#111113]'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Open in Interactive Phone</span>
                </div>
              </div>
            </div>

            <p
              className={`text-xs px-1 leading-relaxed ${
                isDarkMode ? 'text-[#f8f7f4]/55' : 'text-[#111113]/60'
              }`}
            >
              {screen.description}
            </p>
          </div>
        ))}
      </div>

      {/* Editorial Token Reference */}
      <div
        className={`p-6 rounded-[20px] border grid grid-cols-1 md:grid-cols-3 gap-6 ${
          isDarkMode
            ? 'bg-[#1c1c1f] border-[rgba(248,247,244,0.1)]'
            : 'bg-white border-[#111113]/10'
        }`}
      >
        <div>
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.12em] block mb-2 ${
              isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
            }`}
          >
            Display Typography
          </span>
          <p className="font-editorial italic text-2xl font-semibold">Cormorant Garamond</p>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? 'text-[#f8f7f4]/55' : 'text-[#111113]/60'
            }`}
          >
            Editorial headlines, brand mark, and hero INR balances.
          </p>
        </div>

        <div>
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.12em] block mb-2 ${
              isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
            }`}
          >
            Interface & Data
          </span>
          <p className="text-xl font-semibold">Plus Jakarta Sans & IBM Plex Mono</p>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? 'text-[#f8f7f4]/55' : 'text-[#111113]/60'
            }`}
          >
            Crisp tabular figures and uppercase micro-labels.
          </p>
        </div>

        <div>
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.12em] block mb-2 ${
              isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/50'
            }`}
          >
            Core Swatches
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-[#f8f7f4] border border-white/20 block" />
              <span className="font-mono text-[11px]">#f8f7f4</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-[#d4af37] border border-white/20 block" />
              <span className="font-mono text-[11px]">#d4af37</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-[#111113] border border-white/20 block" />
              <span className="font-mono text-[11px]">#111113</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
