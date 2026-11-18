import React, { useState, useRef } from 'react';
import {
  Upload,
  Grid,
  Image as ImageIcon,
  X,
  Check,
} from 'lucide-react';

interface ReferenceInspectorProps {
  referenceImage: string | null;
  onSetReferenceImage: (imgUrl: string | null) => void;
  overlayOpacity: number;
  onSetOverlayOpacity: (opacity: number) => void;
  showGridGuides: boolean;
  onToggleGridGuides: () => void;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const ReferenceInspector: React.FC<ReferenceInspectorProps> = ({
  referenceImage,
  onSetReferenceImage,
  overlayOpacity,
  onSetOverlayOpacity,
  showGridGuides,
  onToggleGridGuides,
  isOpen,
  onClose,
  isDarkMode = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onSetReferenceImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onSetReferenceImage(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative z-10 border rounded-[24px] w-full max-w-xl p-6 overflow-hidden flex flex-col max-h-[90vh] ${
          isDarkMode
            ? 'bg-[#111113] text-[#f8f7f4] border-[rgba(248,247,244,0.14)]'
            : 'bg-[#f8f7f4] text-[#111113] border-[#111113]/15'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#d4af37] text-[#111113] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-semibold">Reference Overlay Inspector</h3>
              <p
                className={`text-xs ${
                  isDarkMode ? 'text-[#f8f7f4]/55' : 'text-[#111113]/60'
                }`}
              >
                Align emulator proportions against a reference screenshot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-[rgba(248,247,244,0.14)] hover:border-[#d4af37]'
                : 'border-[#111113]/15 hover:border-[#111113]'
            }`}
            aria-label="Close overlay inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4 overflow-y-auto hide-scrollbar">
          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-[18px] p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-[#d4af37] bg-[#d4af37]/10'
                : isDarkMode
                ? 'border-[rgba(248,247,244,0.18)] hover:border-[#d4af37] bg-white/[0.02]'
                : 'border-[#111113]/20 hover:border-[#9a7b1c] bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />

            <div className="w-11 h-11 rounded-[14px] bg-[#d4af37] text-[#111113] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold">Click or drop reference screenshot</h4>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? 'text-[#f8f7f4]/50' : 'text-[#111113]/55'
              }`}
            >
              Supports PNG, JPG, WebP
            </p>
          </div>

          {/* Direct URL */}
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="url"
              placeholder="Or paste direct image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className={`flex-1 border rounded-[12px] px-3.5 py-2.5 text-xs focus:outline-none ${
                isDarkMode
                  ? 'bg-[#000000] border-[rgba(248,247,244,0.14)] text-[#f8f7f4] placeholder:text-[#f8f7f4]/40 focus:border-[#d4af37]'
                  : 'bg-white border-[#111113]/15 text-[#111113] placeholder:text-[#111113]/40 focus:border-[#9a7b1c]'
              }`}
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#d4af37] text-[#111113] font-semibold text-xs rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Load
            </button>
          </form>

          {/* Reference Preview & Controls */}
          {referenceImage && (
            <div
              className={`p-4 rounded-[16px] border space-y-4 ${
                isDarkMode
                  ? 'bg-white/[0.03] border-[rgba(248,247,244,0.1)]'
                  : 'bg-white border-[#111113]/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#d4af37] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Reference Loaded
                </span>
                <button
                  onClick={() => onSetReferenceImage(null)}
                  className="text-xs text-red-400 hover:underline font-semibold cursor-pointer"
                >
                  Remove Image
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className={isDarkMode ? 'text-[#f8f7f4]/60' : 'text-[#111113]/65'}>
                    Device Overlay Opacity
                  </span>
                  <span className="font-mono text-[#d4af37]">{Math.round(overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) => onSetOverlayOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#d4af37] cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                />
              </div>

              <div
                className={`flex items-center justify-between pt-3 border-t ${
                  isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-medium">Show 8pt Alignment Grid</span>
                </div>
                <button
                  onClick={onToggleGridGuides}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    showGridGuides ? 'bg-[#d4af37]' : isDarkMode ? 'bg-white/15' : 'bg-black/15'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      showGridGuides ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className={`pt-4 border-t flex justify-end ${
            isDarkMode ? 'border-[rgba(248,247,244,0.1)]' : 'border-[#111113]/10'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-full font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer ${
              isDarkMode
                ? 'bg-[#f8f7f4] text-[#111113]'
                : 'bg-[#111113] text-[#f8f7f4]'
            }`}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
