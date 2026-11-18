import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  ShoppingBag,
  Home,
  Utensils,
  Laptop,
  Navigation,
  Zap,
} from 'lucide-react';
import { WEEKLY_SPENDING, MONTHLY_SPENDING, YEARLY_SPENDING } from '../../data/mockFinancialData';
import { CategoryBudget, SpendingDataPoint } from '../../types';
import { formatINR } from '../../utils/formatCurrency';

interface AnalyticsScreenProps {
  categories: CategoryBudget[];
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ categories }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);

  const periods: Array<'week' | 'month' | 'year'> = ['week', 'month', 'year'];
  const currentPeriodIndex = periods.indexOf(period);
  const prevPeriodIndexRef = useRef(currentPeriodIndex);

  const periodTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [periodSliderStyle, setPeriodSliderStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const [periodTransitionTiming, setPeriodTransitionTiming] = useState({
    duration: 180,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  });

  useEffect(() => {
    const prev = prevPeriodIndexRef.current;
    const distance = Math.abs(currentPeriodIndex - prev);
    prevPeriodIndexRef.current = currentPeriodIndex;

    if (distance > 1) {
      setPeriodTransitionTiming({
        duration: 210,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
    } else {
      setPeriodTransitionTiming({
        duration: 180,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    }

    const updateSlider = () => {
      const activeEl = periodTabRefs.current[period];
      if (activeEl) {
        setPeriodSliderStyle({
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
  }, [period, currentPeriodIndex]);

  const dataPoints: SpendingDataPoint[] =
    period === 'week' ? WEEKLY_SPENDING : period === 'month' ? MONTHLY_SPENDING : YEARLY_SPENDING;

  const maxExpense = Math.max(...dataPoints.map((d) => d.expense));
  const totalPeriodExpense = dataPoints.reduce((acc, d) => acc + d.expense, 0);
  const totalPeriodIncome = dataPoints.reduce((acc, d) => acc + d.income, 0);
  const netSavingsRate = totalPeriodIncome > 0
    ? Math.round(((totalPeriodIncome - totalPeriodExpense) / totalPeriodIncome) * 100)
    : 0;

  const activePoint = activeDataIndex !== null ? dataPoints[activeDataIndex] : dataPoints[dataPoints.length - 1];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Navigation': return <Navigation className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      default: return <ShoppingBag className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4 bg-[#fdfdfd] text-[#000000]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#878787]">Reports & Trends</span>
          <h2 className="text-base font-semibold text-[#000000] tracking-tight">Spending Analytics</h2>
        </div>

        {/* Period Selector Tabs with Dynamic Sliding Pill Animation & Solid Color */}
        <div className="relative flex items-center bg-[#f4f4f5] p-1 rounded-full border border-[#e4e4e7] min-w-[168px]">
          {/* Dynamic Sliding Pill Background Indicator */}
          <div
            className="absolute pointer-events-none will-change-[left,width,transform] z-0"
            style={{
              left: `${periodSliderStyle.left}px`,
              top: `${periodSliderStyle.top}px`,
              width: `${periodSliderStyle.width}px`,
              height: `${periodSliderStyle.height}px`,
              opacity: periodSliderStyle.opacity,
              transitionProperty: 'left, width, transform',
              transitionDuration: `${periodTransitionTiming.duration}ms`,
              transitionTimingFunction: periodTransitionTiming.easing,
            }}
          >
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center" />
          </div>

          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              ref={(el) => {
                periodTabRefs.current[p] = el;
              }}
              onClick={() => {
                setPeriod(p);
                setActiveDataIndex(null);
              }}
              className={`relative z-10 flex-1 px-2.5 py-1 text-xs font-semibold rounded-full capitalize transition-colors duration-200 focus:outline-none select-none text-center cursor-pointer active:scale-95 ${
                period === p
                  ? 'text-white font-semibold'
                  : 'text-zinc-500 font-medium hover:text-black'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Period Summary Card in Obsidian Black */}
      <div className="relative p-5 rounded-[24px] bg-[#0c0c0e] text-[#ffffff] border border-zinc-800 overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-xs font-medium text-zinc-400">
              {activeDataIndex !== null ? `${activePoint.fullDate} Spending` : `Total ${period.toUpperCase()} Outflow`}
            </span>
            <div className="text-3xl font-bold tracking-tight text-white tabular-nums font-mono mt-0.5">
              {formatINR(activePoint.expense)}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Net Savings</span>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">
              {netSavingsRate >= 0 ? `+${netSavingsRate}%` : `${netSavingsRate}%`}
            </div>
          </div>
        </div>

        {/* Interactive SVG Bar Chart with Pure White Highlights */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <div className="h-32 flex items-end justify-between gap-1.5 px-1">
            {dataPoints.map((dp, i) => {
              const heightPct = Math.max(14, Math.round((dp.expense / maxExpense) * 100));
              const isSelected = activeDataIndex === i || (activeDataIndex === null && i === dataPoints.length - 1);

              return (
                <div
                  key={dp.label}
                  onClick={() => setActiveDataIndex(i)}
                  className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  {/* Tooltip on active */}
                  {isSelected && (
                    <span className="text-[10px] font-mono font-bold text-white tracking-tight whitespace-nowrap animate-fadeIn">
                      {formatINR(dp.expense, { compact: true })}
                    </span>
                  )}

                  {/* Bar */}
                  <div className="w-full flex justify-center items-end h-24">
                    <div
                      className={`w-full max-w-[28px] rounded-t-[14px] transition-all duration-300 relative ${
                        isSelected
                          ? 'bg-white'
                          : 'bg-white/20 hover:bg-white/35'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className={`w-full h-1 rounded-t-[14px] ${isSelected ? 'bg-white' : 'bg-transparent'}`} />
                    </div>
                  </div>

                  {/* Day/Month label */}
                  <span
                    className={`text-[10px] tracking-tight transition-colors ${
                      isSelected ? 'text-white font-semibold' : 'text-zinc-500 group-hover:text-white'
                    }`}
                  >
                    {dp.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Income vs Expenses Mini Strip */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-[22px] bg-[#ffffff] border border-[#e4e4e7] flex items-center gap-3">
          <div className="w-9 h-9 rounded-[18px] bg-black text-white flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-medium block">Income</span>
            <span className="text-xs font-semibold text-[#000000] font-mono tabular-nums">
              {formatINR(totalPeriodIncome)}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-[22px] bg-[#ffffff] border border-[#e4e4e7] flex items-center gap-3">
          <div className="w-9 h-9 rounded-[18px] bg-black text-white flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-medium block">Outflow</span>
            <span className="text-xs font-semibold text-[#000000] font-mono tabular-nums">
              {formatINR(totalPeriodExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Insight Callout Card */}
      <div className="p-4 rounded-[22px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-start gap-3">
        <div className="w-8 h-8 rounded-[16px] bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <h4 className="font-semibold text-[#000000]">Smart Spending Insight</h4>
          <p className="text-zinc-600 text-[11px] mt-0.5 leading-relaxed font-serif">
            You spent <strong className="text-black">14% less</strong> on Dining this week. Your projected monthly savings remain at <strong className="text-[#000000] font-mono">{formatINR(28300)}</strong>.
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-bold text-[#000000] tracking-wide uppercase">Categories Breakdown</h3>
          <span className="text-[11px] text-[#878787] font-medium">5 active sectors</span>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => {
            const pct = Math.min(100, Math.round((cat.spent / cat.allocated) * 100));
            const isNearLimit = pct >= 80;

            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-[22px] bg-[#ffffff] border border-[#e4e4e7] hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-[16px] flex items-center justify-center text-white bg-black"
                    >
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#000000]">{cat.name}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {formatINR(cat.spent)} of {formatINR(cat.allocated)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className="text-xs font-semibold font-mono text-black"
                    >
                      {pct}%
                    </span>
                    <span className="block text-[10px] text-zinc-500 font-mono">
                      {formatINR(Math.max(0, cat.allocated - cat.spent))} left
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-black"
                    style={{
                      width: `${pct}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
