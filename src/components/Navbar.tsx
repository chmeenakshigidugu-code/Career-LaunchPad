import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  Bookmark,
  CheckCircle2,
  Search,
  Bell,
  Sliders,
} from 'lucide-react';
import { StudentProfile } from '../types/opportunity';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  profile: StudentProfile;
  savedCount: number;
  applicationsCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfileSetup: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  savedCount,
  applicationsCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenProfileSetup,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const navLinks = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'hackathons', label: 'Hackathons' },
    { id: 'internships', label: 'Internships' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'saved', label: 'Saved', count: savedCount },
    { id: 'applications', label: 'Tracker', count: applicationsCount },
    { id: 'security', label: 'Security' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title as a single clean text element */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('all')}
            className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap focus-visible:outline-2 focus-visible:outline-indigo-600 text-left"
          >
            Career Launchpad
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated Everyday · {todayFormatted}</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-indigo-600 border-indigo-600 font-semibold'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search, Notification Bell & Profile Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative hidden md:block w-44 xl:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Python, AI, remote..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="View Notifications"
            title="Opportunity Alerts"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Setup / Edit Profile CTA */}
          <button
            type="button"
            onClick={onOpenProfileSetup}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              profile.isDemo
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {profile.isDemo ? 'Setup My Profile' : `${profile.name} (Edit)`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg text-left flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span className="font-mono text-[11px]">{item.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              🟢 Updated Everyday · {todayFormatted}
            </span>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenNotifications();
              }}
              className="text-xs font-semibold text-indigo-600"
            >
              Alerts ({unreadNotificationsCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
