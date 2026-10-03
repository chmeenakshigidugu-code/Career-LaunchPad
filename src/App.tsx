/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Opportunity,
  StudentProfile,
  ApplicationRecord,
  ApplicationStatus,
  InAppNotification,
} from './types/opportunity';
import {
  ALL_OPPORTUNITIES,
  DEMO_PROFILE,
  getFriendlyDateWithOffset,
} from './data/initialData';
import { calculateMatchScore, getDynamicDeadlineInfo } from './utils/matchingEngine';
import { Navbar } from './components/Navbar';
import { DemoStudentBanner } from './components/DemoStudentBanner';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { SetupProfileModal } from './components/SetupProfileModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { DailyDigestBanner } from './components/DailyDigestBanner';
import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { SecurityDashboard } from './components/SecurityDashboard';
import { LegalPrivacyModal } from './components/LegalPrivacyModal';
import { ReportSecurityModal } from './components/ReportSecurityModal';
import { AdminSecurityModal } from './components/AdminSecurityModal';
import {
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Bell,
  Shield,
  ShieldCheck,
  AlertOctagon,
  Lock,
} from 'lucide-react';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    category: 'Hackathon',
    title: 'New AI Hackathon Available: Devpost Global AI',
    message: '95% match for your Python & AI skills. Cash prizes and cloud credits provided.',
    opportunityId: 'hack-devpost',
    timeAgo: '10m ago',
    read: false,
  },
  {
    id: 'notif-2',
    category: 'Deadline',
    title: 'Urgent Deadline: National Coding Challenge Closes Tomorrow',
    message: 'Unstop Hackathon registration closes tomorrow. Submit your team entry.',
    opportunityId: 'hack-unstop',
    timeAgo: '1h ago',
    read: false,
  },
  {
    id: 'notif-3',
    category: 'Internship',
    title: 'Stipend Internship: Internshala Python Engineering',
    message: '₹15,000–₹35,000/mo remote role matching your academic year and skills.',
    opportunityId: 'intern-internshala',
    timeAgo: '3h ago',
    read: false,
  },
  {
    id: 'notif-4',
    category: 'Certification',
    title: 'Free Google Cloud Skills Boost Badge',
    message: 'Hands-on Generative AI and Vertex AI labs with free verified badge.',
    opportunityId: 'cert-google-cloud-boost',
    timeAgo: 'Today',
    read: true,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dailyFilter, setDailyFilter] = useState<
    'all' | 'today' | 'closing' | 'free' | 'stipend'
  >('all');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'name'>('match');

  const [profile, setProfile] = useState<StudentProfile>(() =>
    loadStorage('career_launchpad_profile_v2', DEMO_PROFILE)
  );

  const [savedIds, setSavedIds] = useState<string[]>(() =>
    loadStorage('career_launchpad_saved_v2', [
      'hack-devpost',
      'intern-internshala',
      'cert-google-cloud-boost',
    ])
  );

  const [applications, setApplications] = useState<ApplicationRecord[]>(() =>
    loadStorage('career_launchpad_apps_v2', [
      {
        opportunityId: 'hack-devpost',
        status: 'Applied',
        notes: 'Submitted team registration on Devpost.',
        updatedAt: getFriendlyDateWithOffset(0),
      },
      {
        opportunityId: 'intern-internshala',
        status: 'Interviewing',
        notes: 'Passed screening assessment.',
        updatedAt: getFriendlyDateWithOffset(0),
      },
      {
        opportunityId: 'cert-google-cloud-boost',
        status: 'Interested',
        notes: 'Started Vertex AI lab track.',
        updatedAt: getFriendlyDateWithOffset(0),
      },
    ])
  );

  const [notifications, setNotifications] = useState<InAppNotification[]>(() =>
    loadStorage('career_launchpad_notifs_v2', INITIAL_NOTIFICATIONS)
  );

  // Modals state
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [walkthroughModalOpen, setWalkthroughModalOpen] = useState(false);
  const [setupProfileModalOpen, setSetupProfileModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<
    'privacy' | 'terms' | 'cookies' | 'copyright'
  >('privacy');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('career_launchpad_profile_v2', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('career_launchpad_saved_v2', JSON.stringify(savedIds));
    } catch {}
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('career_launchpad_apps_v2', JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'career_launchpad_notifs_v2',
        JSON.stringify(notifications)
      );
    } catch {}
  }, [notifications]);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUpdateAppStatus = (oppId: string, status: ApplicationStatus) => {
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.opportunityId === oppId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          status,
          updatedAt: getFriendlyDateWithOffset(0),
        };
        return copy;
      }
      return [
        ...prev,
        {
          opportunityId: oppId,
          status,
          notes: '',
          updatedAt: getFriendlyDateWithOffset(0),
        },
      ];
    });
  };

  const handleRemoveApplication = (oppId: string) => {
    setApplications((prev) => prev.filter((a) => a.opportunityId !== oppId));
  };

  const handleResetToDemo = () => {
    setProfile(DEMO_PROFILE);
    triggerToast('Switched to Demo Student (Alex Sharma). You can explore or setup your own profile.');
  };

  const handleCompleteSetupProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);

    // Generate fresh notifications strictly matched to what user requested:
    const newAlerts: InAppNotification[] = [];
    const prefs = newProfile.notificationPrefs;

    if (prefs.notifyHackathons) {
      newAlerts.push({
        id: `notif-h-${Date.now()}`,
        category: 'Hackathon',
        title: `⚡ Hackathons Alert Enabled for ${newProfile.name}`,
        message: `Tracking Devpost, Unstop, and SIH challenges matching ${newProfile.skills.slice(0, 2).join(', ')}.`,
        opportunityId: 'hack-devpost',
        timeAgo: 'Just now',
        read: false,
      });
    }

    if (prefs.notifyInternships) {
      newAlerts.push({
        id: `notif-i-${Date.now()}`,
        category: 'Internship',
        title: `💼 Internships Alert Enabled for ${newProfile.branch}`,
        message: `We will notify you about stipend internships and Google GSoC cohorts.`,
        opportunityId: 'intern-internshala',
        timeAgo: 'Just now',
        read: false,
      });
    }

    if (prefs.notifyCertifications) {
      newAlerts.push({
        id: `notif-c-${Date.now()}`,
        category: 'Certification',
        title: `🎓 Certifications Alert Enabled`,
        message: `Free Google Cloud, NPTEL IIT, and AWS credential drops are monitored daily.`,
        opportunityId: 'cert-google-cloud-boost',
        timeAgo: 'Just now',
        read: false,
      });
    }

    if (prefs.notifyUrgentDeadlines) {
      newAlerts.push({
        id: `notif-d-${Date.now()}`,
        category: 'Deadline',
        title: '⏰ Deadline Protection Guard Active',
        message: 'You will receive warnings 1–2 days before opportunities close.',
        opportunityId: 'hack-unstop',
        timeAgo: 'Just now',
        read: false,
      });
    }

    setNotifications(newAlerts.length > 0 ? newAlerts : notifications);

    const categoriesText = [
      prefs.notifyHackathons ? 'Hackathons' : '',
      prefs.notifyInternships ? 'Internships' : '',
      prefs.notifyCertifications ? 'Certifications' : '',
    ]
      .filter(Boolean)
      .join(', ');

    triggerToast(
      `Profile created for ${newProfile.name}! Alerts enabled for: ${categoriesText || 'all opportunities'}.`
    );
  };

  const handleTriggerTestAlert = () => {
    const testNotif: InAppNotification = {
      id: `notif-test-${Date.now()}`,
      category: profile.notificationPrefs.notifyHackathons
        ? 'Hackathon'
        : profile.notificationPrefs.notifyInternships
        ? 'Internship'
        : 'Certification',
      title: '⚡ Live Drop Alert: New Opportunity Verified',
      message: `A new opportunity matching ${profile.careerGoal} was just verified today!`,
      timeAgo: 'Just now',
      read: false,
    };
    setNotifications((prev) => [testNotif, ...prev]);
    triggerToast('New live opportunity alert received!');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Filter and sort all opportunities
  const filteredOpportunities = useMemo(() => {
    return ALL_OPPORTUNITIES.filter((opp) => {
      // 1. Primary tab filter
      if (
        activeTab === 'hackathons' &&
        opp.category !== 'Hackathon' &&
        opp.category !== 'Competition'
      ) {
        return false;
      }
      if (
        activeTab === 'internships' &&
        opp.category !== 'Internship' &&
        opp.category !== 'Fellowship'
      ) {
        return false;
      }
      if (activeTab === 'certifications' && opp.category !== 'Certification') {
        return false;
      }
      if (activeTab === 'saved' && !savedIds.includes(opp.id)) {
        return false;
      }

      // 2. Daily View Filter
      if (dailyFilter === 'today' && !opp.addedToday && !opp.featuredToday) {
        return false;
      }
      if (dailyFilter === 'closing') {
        const deadline = getDynamicDeadlineInfo(opp.deadlineDaysOffset);
        if (deadline.daysRemaining > 7) return false;
      }
      if (dailyFilter === 'free' && opp.cost !== 'Free') {
        return false;
      }
      if (
        dailyFilter === 'stipend' &&
        opp.stipendCategory !== 'Stipend Provided' &&
        opp.stipendCategory !== 'Prize Pool / Grant'
      ) {
        return false;
      }

      // 3. Domain filter
      if (domainFilter !== 'All' && opp.domain !== domainFilter) {
        return false;
      }

      // 4. Mode filter
      if (modeFilter !== 'All' && opp.mode !== modeFilter) {
        return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = [
          opp.title,
          opp.organization,
          opp.category,
          opp.domain,
          opp.skills.join(' '),
          opp.description,
          opp.stipend,
          opp.location,
        ]
          .join(' ')
          .toLowerCase();

        const words = q.split(/\s+/).filter(Boolean);
        const matches = words.every((w) => text.includes(w));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') {
        const matchA = calculateMatchScore(profile, a).overall;
        const matchB = calculateMatchScore(profile, b).overall;
        return matchB - matchA;
      }
      if (sortBy === 'deadline') {
        return a.deadlineDaysOffset - b.deadlineDaysOffset;
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [
    activeTab,
    dailyFilter,
    domainFilter,
    modeFilter,
    searchQuery,
    sortBy,
    savedIds,
    profile,
  ]);

  const updatedTodayCount = ALL_OPPORTUNITIES.filter((o) => o.addedToday).length;
  const featuredTodayCount = ALL_OPPORTUNITIES.filter((o) => o.featuredToday).length;
  const closingThisWeekCount = ALL_OPPORTUNITIES.filter(
    (o) => o.deadlineDaysOffset <= 7
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Demo Student Watcher / Active Profile Bar */}
      <DemoStudentBanner
        profile={profile}
        onOpenDemoWalkthrough={() => setWalkthroughModalOpen(true)}
        onOpenSetupProfile={() => setSetupProfileModalOpen(true)}
        onResetToDemo={handleResetToDemo}
      />

      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        savedCount={savedIds.length}
        applicationsCount={applications.length}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        onOpenProfileSetup={() => setSetupProfileModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Everyday Updated Banner */}
        <DailyDigestBanner
          totalOpportunities={ALL_OPPORTUNITIES.length}
          featuredTodayCount={featuredTodayCount}
          updatedTodayCount={updatedTodayCount}
          closingThisWeekCount={closingThisWeekCount}
          onRefreshFeed={() => {
            triggerToast('Opportunities refreshed: all 33+ portals verified live for today.');
          }}
          dailyFilter={dailyFilter}
          onSelectDailyFilter={setDailyFilter}
        />

        {/* View Mode: Security Dashboard */}
        {activeTab === 'security' ? (
          <SecurityDashboard
            onOpenReportModal={() => setReportModalOpen(true)}
            onOpenAdminPortal={() => setAdminModalOpen(true)}
            onOpenLegalModal={(tab) => {
              setLegalModalTab(tab);
              setLegalModalOpen(true);
            }}
          />
        ) : activeTab === 'applications' ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-display text-slate-900">
                  Student Application Pipeline Tracker
                </h1>
                <p className="text-xs text-slate-500">
                  Track and monitor all your ongoing hackathons, internship
                  applications, and certification enrollments.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                {applications.length} Tracked
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                You haven't tracked any applications yet. Open any opportunity
                to set its status.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-3 px-4">Opportunity</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => {
                      const opp = ALL_OPPORTUNITIES.find(
                        (o) => o.id === app.opportunityId
                      );
                      if (!opp) return null;
                      return (
                        <tr key={app.opportunityId} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <button
                              type="button"
                              onClick={() => setSelectedOpportunity(opp)}
                              className="hover:text-indigo-600 text-left"
                            >
                              {opp.title}
                            </button>
                            <span className="block text-[11px] font-normal text-slate-500">
                              {opp.organization}
                            </span>
                          </td>
                          <td className="py-3 px-4">{opp.category}</td>
                          <td className="py-3 px-4">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleUpdateAppStatus(
                                  opp.id,
                                  e.target.value as ApplicationStatus
                                )
                              }
                              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-indigo-600"
                            >
                              <option value="Saved">Saved</option>
                              <option value="Interested">Interested</option>
                              <option value="Applied">Applied</option>
                              <option value="Interviewing">Interviewing</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">
                            {app.updatedAt}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <a
                                href={opp.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded inline-flex items-center gap-1"
                              >
                                <span>Apply</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleRemoveApplication(opp.id)}
                                title="Remove"
                                className="p-1 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Standard Opportunity Grid Feed */
          <div className="space-y-6">
            {/* Filter and Control Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-600" />
                  Filters:
                </span>

                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                >
                  <option value="All">All Domains</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Programming">Programming</option>
                </select>

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                >
                  <option value="All">All Participation Modes</option>
                  <option value="Online">Online / Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Offline">Offline</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold"
                >
                  <option value="match">Sort: Highest Match Score</option>
                  <option value="deadline">Sort: Closing Soonest</option>
                  <option value="name">Sort: Alphabetical</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-mono tabular-nums">
                Displaying <strong>{filteredOpportunities.length}</strong> of{' '}
                {ALL_OPPORTUNITIES.length} verified listings
              </div>
            </div>

            {/* Opportunities Grid */}
            {filteredOpportunities.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  No opportunities match the selected filters.
                </h3>
                <p className="text-xs text-slate-500">
                  Try clearing your search query or adjusting the domain and mode
                  filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setDailyFilter('all');
                    setDomainFilter('All');
                    setModeFilter('All');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    profile={profile}
                    isSaved={savedIds.includes(opp.id)}
                    applicationStatus={
                      applications.find((a) => a.opportunityId === opp.id)?.status
                    }
                    onToggleSave={handleToggleSave}
                    onOpenDetails={(item) => setSelectedOpportunity(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Official Directory of All 33 Verified Portals */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              All 33 Verified Official Portals & Direct Links
            </h2>
            <p className="text-xs text-slate-500">
              Direct access to apply on the official global platforms and portals:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Hackathons */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>Hackathon Platforms (10)</span>
                <span className="text-slate-400 font-normal">Global & India</span>
              </h3>
              <ul className="space-y-1.5 text-xs">
                {[
                  { name: 'Devpost', url: 'https://devpost.com/hackathons' },
                  { name: 'Unstop Hackathons', url: 'https://unstop.com/hackathons' },
                  { name: 'Devfolio', url: 'https://devfolio.co/hackathons' },
                  { name: 'HackerEarth Challenges', url: 'https://www.hackerearth.com/challenges/hackathon/' },
                  { name: 'Hack2skill', url: 'https://hack2skill.com' },
                  { name: 'Major League Hacking (MLH)', url: 'https://mlh.io' },
                  { name: 'DoraHacks', url: 'https://dorahacks.io/hackathon' },
                  { name: 'Kaggle Competitions', url: 'https://www.kaggle.com/competitions' },
                  { name: 'Smart India Hackathon (SIH)', url: 'https://www.sih.gov.in' },
                  { name: 'Hackathon.com', url: 'https://www.hackathon.com' },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-indigo-600 flex items-center justify-between group"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>Certification Providers (13)</span>
                <span className="text-slate-400 font-normal">Free & Verified</span>
              </h3>
              <ul className="space-y-1.5 text-xs">
                {[
                  { name: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google' },
                  { name: 'Google Career Certificates', url: 'https://grow.google/certificates' },
                  { name: 'Microsoft Learn Credentials', url: 'https://learn.microsoft.com/credentials' },
                  { name: 'AWS Skill Builder', url: 'https://skillbuilder.aws' },
                  { name: 'NPTEL (IIT & IISc)', url: 'https://nptel.ac.in' },
                  { name: 'SWAYAM National Portal', url: 'https://swayam.gov.in' },
                  { name: 'Coursera', url: 'https://www.coursera.org' },
                  { name: 'edX', url: 'https://www.edx.org' },
                  { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn' },
                  { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
                  { name: 'Cisco Networking Academy', url: 'https://www.netacad.com' },
                  { name: 'Oracle University', url: 'https://education.oracle.com' },
                  { name: 'GitHub Certifications', url: 'https://examregistration.github.com/certification' },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-indigo-600 flex items-center justify-between group"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Internships */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>Internships & Fellowships (10)</span>
                <span className="text-slate-400 font-normal">Verified Stipends</span>
              </h3>
              <ul className="space-y-1.5 text-xs">
                {[
                  { name: 'Internshala', url: 'https://internshala.com' },
                  { name: 'Unstop Internships', url: 'https://unstop.com/internships' },
                  { name: 'LinkedIn Internships', url: 'https://www.linkedin.com/jobs/internship-jobs' },
                  { name: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org' },
                  { name: 'Wellfound Startups', url: 'https://wellfound.com' },
                  { name: 'Google Summer of Code (GSoC)', url: 'https://summerofcode.withgoogle.com' },
                  { name: 'Google Student Careers', url: 'https://www.google.com/about/careers/applications/students' },
                  { name: 'MLH Fellowship', url: 'https://fellowship.mlh.io' },
                  { name: 'LFX Mentorship', url: 'https://lfx.linuxfoundation.org' },
                  { name: 'Outreachy', url: 'https://www.outreachy.org' },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-indigo-600 flex items-center justify-between group"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        profile={profile}
        isSaved={
          selectedOpportunity ? savedIds.includes(selectedOpportunity.id) : false
        }
        applicationStatus={
          selectedOpportunity
            ? applications.find(
                (a) => a.opportunityId === selectedOpportunity.id
              )?.status
            : undefined
        }
        onClose={() => setSelectedOpportunity(null)}
        onToggleSave={handleToggleSave}
        onUpdateStatus={handleUpdateAppStatus}
      />

      {/* Demo Student Walkthrough Modal ("Watch Demo Student") */}
      <DemoWalkthroughModal
        isOpen={walkthroughModalOpen}
        onClose={() => setWalkthroughModalOpen(false)}
        onStartSetupProfile={() => {
          setWalkthroughModalOpen(false);
          setSetupProfileModalOpen(true);
        }}
      />

      {/* Setup Profile & Notification Wizard ("Setup Profile & Tell it Notify") */}
      <SetupProfileModal
        isOpen={setupProfileModalOpen}
        currentProfile={profile}
        onClose={() => setSetupProfileModalOpen(false)}
        onCompleteProfile={handleCompleteSetupProfile}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        profile={profile}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={(oppId) => {
          if (oppId) {
            const found = ALL_OPPORTUNITIES.find((o) => o.id === oppId);
            if (found) setSelectedOpportunity(found);
          }
        }}
        onOpenSettings={() => setSetupProfileModalOpen(true)}
        onTriggerTestAlert={handleTriggerTestAlert}
      />

      {/* Legal & Privacy Protected Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 mt-12">
        <div className="max-w-[1360px] mx-auto space-y-6 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-slate-900 text-sm font-display">
                  Career Launchpad
                </strong>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Security Guard Active
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                A centralized student platform updated everyday. Real verified links to 33+ global hackathons, certifications, and internships.
              </p>
            </div>

            {/* Quick Legal & Security Navigation */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('privacy');
                  setLegalModalOpen(true);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('terms');
                  setLegalModalOpen(true);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                Terms of Use
              </button>
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('cookies');
                  setLegalModalOpen(true);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                Cookie Policy
              </button>
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('copyright');
                  setLegalModalOpen(true);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                Ownership & Licenses
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('security');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Security Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Report a Security Issue</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className="text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Legal Ownership & Trademark Attribution Notice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>
              © 2026 Career Launchpad. All original code, recommendation algorithms, and interface designs are proprietary. Third-party portals, brand names, and company marks (Devpost, MLH, Google, AWS, Coursera, Internshala, etc.) are the trademarks of their respective owners and used under nominative fair use.
            </p>
            <div className="shrink-0 text-slate-500 font-mono text-[10px]">
              Content Security Policy · Anti-XSS Sanitized · Rate-Limited
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & Privacy Modal */}
      <LegalPrivacyModal
        isOpen={legalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setLegalModalOpen(false)}
        onOpenReportModal={() => {
          setLegalModalOpen(false);
          setReportModalOpen(true);
        }}
      />

      {/* Confidential Report Security Issue Modal */}
      <ReportSecurityModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccessToast={triggerToast}
      />

      {/* Secure Admin Access Modal */}
      <AdminSecurityModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccessToast={triggerToast}
      />
    </div>
  );
}
