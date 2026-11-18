import React, { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  bottomBar?: ReactNode;
  dynamicIslandMessage?: string | null;
  currentTime?: string;
  className?: string;
  isDarkMode?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  bottomBar,
  dynamicIslandMessage = null,
  currentTime = '9:41',
  className = '',
  isDarkMode = true,
}) => {
  return (
    <div className={`relative mx-auto select-none ${className}`}>
      {/* Outer Phone Shell in crisp obsidian matching Variation 3 */}
      <div
        className={`relative w-full max-w-[385px] h-[780px] rounded-[54px] p-3 border flex flex-col overflow-hidden transition-colors duration-200 ${
          isDarkMode
            ? 'bg-[#000000] border-[rgba(248,247,244,0.14)]'
            : 'bg-[#1a1a1d] border-[#111113]/20'
        }`}
      >
        {/* Screen Glass Surface */}
        <div
          className={`relative w-full h-full rounded-[42px] overflow-hidden flex flex-col border transition-colors duration-200 ${
            isDarkMode
              ? 'bg-[#000000] text-[#f8f7f4] border-[rgba(248,247,244,0.1)]'
              : 'bg-[#f8f7f4] text-[#111113] border-[#111113]/10'
          }`}
        >
          {/* Minimalist Editorial Status Bar (9:41 — Pill — LTE) */}
          <div
            className={`relative z-40 h-11 px-6 pt-2 flex items-center justify-between shrink-0 transition-colors duration-200 ${
              isDarkMode ? 'bg-[#000000] text-[#f8f7f4]' : 'bg-[#f8f7f4] text-[#111113]'
            }`}
          >
            {/* Clock */}
            <span
              className={`font-mono text-[10px] tracking-[0.12em] uppercase ${
                isDarkMode ? 'text-[#f8f7f4]/60' : 'text-[#111113]/60'
              }`}
            >
              {currentTime}
            </span>

            {/* Dynamic Island */}
            <div
              className={`transition-all duration-200 ease-out flex items-center justify-center rounded-full px-3 ${
                dynamicIslandMessage
                  ? isDarkMode
                    ? 'min-w-[185px] h-6 bg-[#18181b] border border-[#d4af37]/40'
                    : 'min-w-[185px] h-6 bg-[#111113] border border-[#d4af37]/50'
                  : isDarkMode
                  ? 'w-[56px] h-[18px] bg-white/10'
                  : 'w-[56px] h-[18px] bg-black/10'
              }`}
            >
              {dynamicIslandMessage && (
                <span className="truncate max-w-[160px] text-[10px] font-mono tracking-wide text-[#f8f7f4]">
                  {dynamicIslandMessage}
                </span>
              )}
            </div>

            {/* Carrier */}
            <span
              className={`font-mono text-[10px] tracking-[0.12em] uppercase ${
                isDarkMode ? 'text-[#f8f7f4]/60' : 'text-[#111113]/60'
              }`}
            >
              LTE
            </span>
          </div>

          {/* Screen Scrollable Content */}
          <div
            className={`relative flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col ${
              isDarkMode ? 'bg-[#000000]' : 'bg-[#f8f7f4]'
            }`}
          >
            {children}
          </div>

          {/* Floating Pill Action Switcher */}
          {bottomBar && (
            <div className="pointer-events-none absolute bottom-3.5 inset-x-0 z-40 flex justify-center px-4">
              {bottomBar}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
