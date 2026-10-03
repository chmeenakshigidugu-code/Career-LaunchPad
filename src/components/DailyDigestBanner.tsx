import React, { useState, useEffect } from 'react';
import {
  Calendar,
  RefreshCw,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface DailyDigestBannerProps {
  totalOpportunities: number;
  featuredTodayCount: number;
  updatedTodayCount: number;
  closingThisWeekCount: number;
  onRefreshFeed: () => void;
  dailyFilter: 'all' | 'today' | 'closing' | 'free' | 'stipend';
  onSelectDailyFilter: (f: 'all' | 'today' | 'closing' | 'free' | 'stipend') => void;
}

export const DailyDigestBanner: React.FC<DailyDigestBannerProps> = ({
  totalOpportunities,
  featuredTodayCount,
  updatedTodayCount,
  closingThisWeekCount,
  onRefreshFeed,
  dailyFilter,
  onSelectDailyFilter,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [timeToMidnight, setTimeToMidnight] = useState<string>('');

  const now = new Date();
  const fullDateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    function updateCountdown() {
      const current = new Date();
      const midnight = new Date(current);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - current.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeToMidnight(`${hours}h ${mins}m`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    onRefreshFeed();
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshedTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 400);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-800 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-300 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {fullDateString}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold">
              Live Everyday Sync Active
            </span>
            <span aria-hidden="true">·</span>
            <span>Next daily cycle in {timeToMidnight}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Today’s Verified Opportunity Feed
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Every day, this hub synchronizes active hackathons, certifications, and
            internship deadlines across 33+ verified official platforms. All
            opportunities are kept fresh with rolling daily deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span>{refreshing ? 'Refreshing...' : 'Daily Live Refresh'}</span>
          </button>
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            Updated: {lastRefreshedTime}
          </div>
        </div>
      </div>

      {/* Everyday Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Total Live Opportunities</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-0.5">
            {totalOpportunities}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            All 33+ Verified Portals
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Updated Today</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-400 mt-0.5">
            {updatedTodayCount}
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">
            Freshly verified listings
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Closing This Week</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-0.5">
            {closingThisWeekCount}
          </div>
          <div className="text-[10px] text-amber-300 mt-0.5">
            Deadline protection alert
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Featured Today</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
            {featuredTodayCount}
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5">
            Top recommended picks
          </div>
        </div>
      </div>

      {/* Everyday Filter Buttons */}
      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Daily View Filter:</span>
        {[
          { id: 'all', label: `All Opportunities (${totalOpportunities})` },
          { id: 'today', label: `Updated Today (${updatedTodayCount})` },
          { id: 'closing', label: `Closing This Week (${closingThisWeekCount})` },
          { id: 'free', label: '100% Free / Sponsored' },
          { id: 'stipend', label: 'Stipends & Prize Pools' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() =>
              onSelectDailyFilter(
                f.id as 'all' | 'today' | 'closing' | 'free' | 'stipend'
              )
            }
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              dailyFilter === f.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};
