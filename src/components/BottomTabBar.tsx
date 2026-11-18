import React, { useRef, useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, CreditCard } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomTabBarProps {
  activeTab: ScreenId;
  onTabChange: (tab: ScreenId) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'Home', icon: LayoutDashboard },
    { id: 'analytics' as ScreenId, label: 'Analytics', icon: BarChart3 },
    { id: 'cards' as ScreenId, label: 'Cards', icon: CreditCard },
  ];

  const currentIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab));
  const prevIndexRef = useRef(currentIndex);

  // Dynamic slider measurement ref & state
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [sliderStyle, setSliderStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const [transitionTiming, setTransitionTiming] = useState({
    duration: 180,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  });

  useEffect(() => {
    const prev = prevIndexRef.current;
    const distance = Math.abs(currentIndex - prev);
    prevIndexRef.current = currentIndex;

    if (distance > 1) {
      setTransitionTiming({
        duration: 210,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
    } else {
      setTransitionTiming({
        duration: 180,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    }

    const updateSlider = () => {
      const activeEl = tabRefs.current[activeTab];
      if (activeEl) {
        setSliderStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
          opacity: 1,
        });
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [activeTab, currentIndex]);

  return (
    <div className="sticky bottom-2 inset-x-0 z-40 px-3 py-1 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto relative mx-auto w-full max-w-[280px] bg-[#fdfdfd]/95 backdrop-blur-xl border border-[#e7e7ee] rounded-full p-1.5"
      >
        <div className="relative flex items-center justify-between">
          {/* Dynamic Sliding Pill Indicator with restrained easing */}
          <div
            className="absolute pointer-events-none will-change-[left,width,transform] z-0"
            style={{
              left: `${sliderStyle.left}px`,
              top: `${sliderStyle.top}px`,
              width: `${sliderStyle.width}px`,
              height: `${sliderStyle.height}px`,
              opacity: sliderStyle.opacity,
              transitionProperty: 'left, width, transform',
              transitionDuration: `${transitionTiming.duration}ms`,
              transitionTimingFunction: transitionTiming.easing,
            }}
          >
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center relative">
              {/* Top right subtle accent dot in white */}
              <span className="absolute top-1.5 right-3 w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>

          {/* Tab Buttons */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                onClick={() => onTabChange(tab.id)}
                className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-full transition-all active:scale-95 focus:outline-none select-none cursor-pointer group"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative flex items-center justify-center h-5 w-5">
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      isActive
                        ? 'text-white scale-110 stroke-[2.3]'
                        : 'text-zinc-500 stroke-[1.8] group-hover:text-black group-hover:scale-105'
                    }`}
                  />
                </div>

                {/* Tab Label */}
                <span
                  className={`text-[10px] tracking-tight mt-0.5 transition-colors duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-500 font-medium group-hover:text-black'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
