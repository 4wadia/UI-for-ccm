import React from 'react';
import { X, CheckCircle2, ArrowUpRight, ArrowDownLeft, Share2, Download, Copy } from 'lucide-react';
import { Transaction } from '../../types';
import { formatINR } from '../../utils/formatCurrency';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  isDarkMode = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(transaction.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative z-10 w-full sm:max-w-[400px] border rounded-t-[28px] sm:rounded-[24px] p-6 max-h-[90vh] overflow-y-auto hide-scrollbar ${
          isDarkMode
            ? 'bg-[#1c1c1f] text-[#f8f7f4] border-[rgba(248,247,244,0.14)]'
            : 'bg-[#f8f7f4] text-[#111113] border-[#111113]/15'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'
              }`}
            >
              Transaction Receipt
            </span>
            <span className="font-mono text-[10px] text-[#d4af37]">· Verified</span>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-[rgba(248,247,244,0.12)] hover:border-[#d4af37] text-[#f8f7f4]'
                : 'border-[#111113]/15 hover:border-[#111113] text-[#111113]'
            }`}
            aria-label="Close receipt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Block */}
        <div
          className={`flex flex-col items-center text-center py-5 border-b ${
            isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full border flex items-center justify-center mb-3 ${
              isDarkMode
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-[#111113] text-[#111113]'
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="w-5 h-5 stroke-[2]" />
            ) : (
              <ArrowUpRight className="w-5 h-5 stroke-[2]" />
            )}
          </div>

          <div className="font-editorial text-4xl font-semibold tracking-tight tabular-nums">
            {isIncome ? '+' : '-'}
            {formatINR(transaction.amount)}
          </div>
          <p className="text-sm font-medium mt-1.5">{transaction.title}</p>
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.1em] mt-1 ${
              isDarkMode ? 'text-[#f8f7f4]/45' : 'text-[#111113]/50'
            }`}
          >
            {transaction.date}
          </p>
        </div>

        {/* Breakdown Rows */}
        <div
          className={`py-4 space-y-3 text-xs border-b ${
            isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10'
          }`}
        >
          <div className="flex justify-between items-center py-0.5">
            <span className={isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'}>Status</span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
              Completed & Settled
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className={isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'}>Category</span>
            <span className="font-medium">{transaction.category}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className={isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'}>Card</span>
            <span className="font-medium">
              {transaction.cardBank || 'Indian Bank Card'} · •••• {transaction.cardLast4}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className={isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'}>Merchant</span>
            <span className="font-medium">{transaction.merchant}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className={isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'}>Reference</span>
            <button
              onClick={handleCopyRef}
              className="flex items-center gap-1.5 font-mono text-[11px] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <span>{transaction.referenceId}</span>
              <Copy className="w-3 h-3 opacity-60" />
              {copied && <span className="text-[10px] text-[#d4af37]">Copied</span>}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyRef}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-semibold text-xs border transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-[rgba(248,247,244,0.15)] text-[#f8f7f4] hover:border-[#d4af37]'
                : 'border-[#111113]/20 text-[#111113] hover:border-[#111113]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Copy</span>
          </button>
          <button
            onClick={handleCopyRef}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer ${
              isDarkMode
                ? 'bg-[#f8f7f4] text-[#111113]'
                : 'bg-[#111113] text-[#f8f7f4]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
