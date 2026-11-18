/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_CARDS,
  INITIAL_TRANSACTIONS,
  INITIAL_CATEGORY_BUDGETS,
} from './data/mockFinancialData';
import { CreditCard, CategoryBudget, Transaction, ScreenId, ViewMode } from './types';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { CardsScreen } from './components/screens/CardsScreen';
import { ManageCardScreen } from './components/screens/ManageCardScreen';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { NewCardModal } from './components/modals/NewCardModal';
import { ArtboardShowcase } from './components/showcase/ArtboardShowcase';
import { ReferenceInspector } from './components/showcase/ReferenceInspector';
import { formatINR } from './utils/formatCurrency';

const BRAND_TAG_MAP: Record<string, string> = {
  visa: 'VISA',
  rupay: 'RUPAY',
  mastercard: 'MC',
  amex: 'AMEX',
  diners: 'DINERS',
};

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ScreenId>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('device');
  const [selectedCardForManage, setSelectedCardForManage] = useState<CreditCard | null>(null);

  // Variation 3 Editorial Dark Theme default, toggleable to Light Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Application Data Stores
  const [cards, setCards] = useState<CreditCard[]>(INITIAL_CARDS);
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [categories] = useState<CategoryBudget[]>(INITIAL_CATEGORY_BUDGETS);

  // Modals & Interactive States
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [dynamicIslandMessage, setDynamicIslandMessage] = useState<string | null>(null);

  // Reference Screenshot Comparison Tool
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.35);
  const [showGridGuides, setShowGridGuides] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const triggerNotification = (msg: string) => {
    setDynamicIslandMessage(msg);
    setTimeout(() => {
      setDynamicIslandMessage(null);
    }, 3200);
  };

  const handleToggleFreeze = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const willFreeze = !c.isFrozen;
          triggerNotification(willFreeze ? 'Card Frozen · Blocked' : 'Card Unfrozen · Active');
          return { ...c, isFrozen: willFreeze };
        }
        return c;
      })
    );
  };

  const handleUpdateLimit = (cardId: string, limit: number) => {
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, dailyLimit: limit } : c)));
  };

  const handleToggleContactless = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, contactlessEnabled: !c.contactlessEnabled } : c))
    );
    triggerNotification('NFC Settings Updated');
  };

  const handleToggleOnline = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, onlinePaymentsEnabled: !c.onlinePaymentsEnabled } : c))
    );
    triggerNotification('Online Security Updated');
  };

  const handleAddCard = (newCard: CreditCard) => {
    setCards((prev) => [newCard, ...prev]);
    triggerNotification(`New ${newCard.cardTier} Issued`);
  };

  const renderActiveScreen = () => {
    if (selectedCardForManage) {
      return (
        <ManageCardScreen
          card={selectedCardForManage}
          transactions={transactions}
          onBack={() => setSelectedCardForManage(null)}
          isDarkMode={isDarkMode}
        />
      );
    }

    if (activeTab === 'cards') {
      return (
        <CardsScreen
          cards={cards}
          onOpenNewCardModal={() => setIsNewCardModalOpen(true)}
          onSelectCard={(card) => setSelectedCardForManage(card)}
          isDarkMode={isDarkMode}
        />
      );
    }

    return (
      <HomeScreen
        cards={cards}
        transactions={transactions}
        onSelectTransaction={setSelectedTransaction}
        onOpenNewCardModal={() => setIsNewCardModalOpen(true)}
        onNavigateToCards={() => {
          setSelectedCardForManage(null);
          setActiveTab('cards');
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
    );
  };

  const borderMuted = isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10';
  const dimText = isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#000000] text-[#f8f7f4] selection:bg-[#d4af37] selection:text-[#111113]'
          : 'bg-[#f8f7f4] text-[#111113] selection:bg-[#d4af37] selection:text-[#111113]'
      }`}
    >
      {/* Top Editorial Header (Matches Variation 3) */}
      <header
        className={`sticky top-0 z-40 px-6 lg:px-12 py-5 flex items-center justify-between gap-8 border-b transition-colors duration-200 ${
          isDarkMode ? 'bg-[#000000] border-[rgba(248,247,244,0.1)]' : 'bg-[#f8f7f4] border-[#111113]/10'
        }`}
      >
        {/* Zone 1: Single Italic Serif Wordmark */}
        <button
          type="button"
          onClick={() => {
            setViewMode('device');
            setSelectedCardForManage(null);
            setActiveTab('home');
          }}
          className="font-editorial italic text-[28px] leading-none tracking-[-0.02em] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
        >
          Onyx Cards
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={() => setViewMode('device')}
            className={`text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              viewMode === 'device'
                ? isDarkMode
                  ? 'text-[#f8f7f4] border-b border-[#d4af37]'
                  : 'text-[#111113] border-b border-[#111113]'
                : `${dimText} hover:opacity-80`
            }`}
          >
            Interactive Phone
          </button>
          <button
            type="button"
            onClick={() => setViewMode('showcase')}
            className={`text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              viewMode === 'showcase'
                ? isDarkMode
                  ? 'text-[#f8f7f4] border-b border-[#d4af37]'
                  : 'text-[#111113] border-b border-[#111113]'
                : `${dimText} hover:opacity-80`
            }`}
          >
            3 Artboards
          </button>
          <span className={`font-mono text-[10px] uppercase tracking-[0.12em] whitespace-nowrap shrink-0 ${dimText}`}>
            INR (₹) Portfolio
          </span>
        </nav>

        {/* Zone 3: Action Controls (Ref Overlay + Light/Dark Mode) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsInspectorOpen(true)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0 ${
              isDarkMode ? 'bg-[#f8f7f4] text-[#111113]' : 'bg-[#111113] text-[#f8f7f4]'
            }`}
          >
            {referenceImage ? 'Ref Active' : 'Ref Overlay'}
          </button>

          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isDarkMode
                ? 'bg-transparent border-[rgba(248,247,244,0.16)] text-[#f8f7f4] hover:border-[#d4af37]'
                : 'bg-transparent border-[#111113]/20 text-[#111113] hover:border-[#111113]'
            }`}
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col justify-center">
        {viewMode === 'device' ? (
          <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px_1fr] gap-8 lg:gap-10 items-center">
            {/* LEFT ASIDE: 01. My Portfolio -> Your Cards */}
            <aside className="flex flex-col justify-center order-2 lg:order-1">
              <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${dimText}`}>
                01. My Portfolio
              </span>
              <h2 className="font-editorial text-[34px] leading-tight font-semibold mt-2">
                Your Cards
              </h2>

              <div className="flex flex-col gap-1.5 mt-4">
                {cards.map((card) => {
                  const isActiveCard = selectedCardForManage?.id === card.id;
                  return (
                    <button
                      type="button"
                      key={card.id}
                      onClick={() => {
                        setSelectedCardForManage(card);
                        setActiveTab('cards');
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-[6px] flex items-center justify-between transition-colors cursor-pointer ${
                        isDarkMode
                          ? isActiveCard
                            ? 'bg-[#26262a] text-[#d4af37]'
                            : 'bg-[#1c1c1f] hover:bg-[#242428]'
                          : isActiveCard
                          ? 'bg-black/[0.08] text-[#9a7b1c]'
                          : 'bg-black/[0.03] hover:bg-black/[0.06]'
                      }`}
                    >
                      <div>
                        <p className="text-[13px] font-medium">{card.bankName}</p>
                        <p
                          className={`font-mono text-[10px] uppercase tracking-[0.08em] mt-0.5 tabular-nums ${dimText}`}
                        >
                          {formatINR(card.limit, { compact: true })} · {card.maskedNumber}
                        </p>
                      </div>

                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-[4px] ${
                          isDarkMode
                            ? 'bg-white/10 text-[#f8f7f4]'
                            : 'bg-black/5 text-[#111113]'
                        }`}
                      >
                        {BRAND_TAG_MAP[card.brand] || card.brand.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsNewCardModalOpen(true)}
                className="mt-6 w-full sm:w-auto self-start rounded-full px-8 py-3.5 text-xs font-semibold bg-[#d4af37] text-[#111113] hover:opacity-90 transition-opacity active:scale-[0.99] cursor-pointer"
              >
                + Issue Card
              </button>
            </aside>

            {/* CENTER: Interactive Phone Emulator */}
            <section className="relative flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-[385px]">
                {showGridGuides && (
                  <div
                    className="absolute inset-0 z-30 pointer-events-none rounded-[42px] m-3 opacity-25"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }}
                  />
                )}

                {referenceImage && (
                  <div
                    className="absolute inset-0 z-30 pointer-events-none rounded-[42px] m-3 overflow-hidden"
                    style={{ opacity: overlayOpacity }}
                  >
                    <img
                      src={referenceImage}
                      alt="Reference Overlay"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <PhoneFrame
                  isDarkMode={isDarkMode}
                  dynamicIslandMessage={dynamicIslandMessage}
                  bottomBar={
                    selectedCardForManage ? null : (
                      <div
                        className={`pointer-events-auto relative grid grid-cols-2 w-[210px] p-1 rounded-full transition-colors duration-200 ${
                          isDarkMode ? 'bg-[#1c1c1f]' : 'bg-[#ffffff]'
                        }`}
                      >
                        {/* Sliding Active Pill Indicator */}
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            activeTab === 'cards' ? 'translate-x-full' : 'translate-x-0'
                          } ${isDarkMode ? 'bg-[#f8f7f4]' : 'bg-[#111113]'}`}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCardForManage(null);
                            setActiveTab('home');
                          }}
                          className={`relative z-10 py-2 px-4 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                            activeTab === 'home'
                              ? isDarkMode
                                ? 'text-[#111113]'
                                : 'text-[#f8f7f4]'
                              : isDarkMode
                              ? 'text-[#f8f7f4]/65 hover:text-[#f8f7f4]'
                              : 'text-[#111113]/65 hover:text-[#111113]'
                          }`}
                        >
                          Home
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCardForManage(null);
                            setActiveTab('cards');
                          }}
                          className={`relative z-10 py-2 px-4 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                            activeTab === 'cards'
                              ? isDarkMode
                                ? 'text-[#111113]'
                                : 'text-[#f8f7f4]'
                              : isDarkMode
                              ? 'text-[#f8f7f4]/65 hover:text-[#f8f7f4]'
                              : 'text-[#111113]/65 hover:text-[#111113]'
                          }`}
                        >
                          Cards
                        </button>
                      </div>
                    )
                  }
                >
                  {renderActiveScreen()}
                </PhoneFrame>
              </div>
            </section>

            {/* RIGHT ASIDE: 02. Design Tokens & System Features */}
            <aside className="flex flex-col justify-center lg:items-end lg:text-right order-3">
              <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${dimText}`}>
                02. Design Tokens
              </span>

              <div className="mt-7 w-full">
                {/* Color Swatch Strip */}
                <div className="flex lg:justify-end gap-2 mb-6">
                  <div
                    title="Ivory Ink (#f8f7f4)"
                    className={`w-[30px] h-[30px] bg-[#f8f7f4] border ${borderMuted}`}
                  />
                  <div
                    title="Brushed Gold (#d4af37)"
                    className={`w-[30px] h-[30px] bg-[#d4af37] border ${borderMuted}`}
                  />
                  <div
                    title="Obsidian Surface (#111113)"
                    className={`w-[30px] h-[30px] bg-[#111113] border ${borderMuted}`}
                  />
                </div>

                <p className={`font-mono text-[10px] uppercase tracking-[0.12em] mb-3 ${dimText}`}>
                  System Features
                </p>

                <div className="border-r border-[#d4af37] pr-4 space-y-1.5 leading-relaxed">
                  <p className="text-xs">Vertical card list sorting</p>
                  <p className="text-xs">Interactive spend tracking</p>
                  <p className="text-xs">Real-time balance analytics</p>
                  <p className="text-xs">Refined dark/light themes</p>
                </div>

                <p className={`mt-7 text-[11px] leading-relaxed italic max-w-xs lg:ml-auto ${dimText}`}>
                  Explore your financial portfolio with Onyx’s proprietary interface designed for the Indian banking ecosystem.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <ArtboardShowcase
            cards={cards}
            transactions={transactions}
            categories={categories}
            onSelectScreenToEmulate={(tab) => {
              setActiveTab(tab);
              setViewMode('device');
            }}
            onSelectTransaction={setSelectedTransaction}
            onToggleFreeze={handleToggleFreeze}
            onUpdateLimit={handleUpdateLimit}
            onToggleContactless={handleToggleContactless}
            onToggleOnline={handleToggleOnline}
            onOpenNewCardModal={() => setIsNewCardModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer
        className={`px-6 lg:px-12 py-5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 ${
          isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10'
        }`}
      >
        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${dimText}`}>
          © 2026 ONYX FINANCIAL SYSTEMS
        </span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${dimText}`}>
          DESIGNED IN BENGALURU
        </span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${dimText}`}>
          9:41 AM · LOCAL TIME
        </span>
      </footer>

      {/* Global Modals */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        isDarkMode={isDarkMode}
      />

      <NewCardModal
        isOpen={isNewCardModalOpen}
        onClose={() => setIsNewCardModalOpen(false)}
        onAddCard={handleAddCard}
        isDarkMode={isDarkMode}
      />

      <ReferenceInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        referenceImage={referenceImage}
        onSetReferenceImage={setReferenceImage}
        overlayOpacity={overlayOpacity}
        onSetOverlayOpacity={setOverlayOpacity}
        showGridGuides={showGridGuides}
        onToggleGridGuides={() => setShowGridGuides(!showGridGuides)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
