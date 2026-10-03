import React from 'react';
import {
  User,
  Sparkles,
  ArrowRight,
  Bell,
  RotateCcw,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { StudentProfile } from '../types/opportunity';

interface DemoStudentBannerProps {
  profile: StudentProfile;
  onOpenDemoWalkthrough: () => void;
  onOpenSetupProfile: () => void;
  onResetToDemo: () => void;
}

export const DemoStudentBanner: React.FC<DemoStudentBannerProps> = ({
  profile,
  onOpenDemoWalkthrough,
  onOpenSetupProfile,
  onResetToDemo,
}) => {
  const isDemo = profile.isDemo ?? false;

  const enabledAlerts: string[] = [];
  if (profile.notificationPrefs.notifyHackathons) enabledAlerts.push('Hackathons');
  if (profile.notificationPrefs.notifyInternships) enabledAlerts.push('Internships');
  if (profile.notificationPrefs.notifyCertifications)
    enabledAlerts.push('Certifications');

  if (isDemo) {
    return (
      <aside aria-label="Demo Student Guide" className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border-b border-indigo-800/60 py-3.5 px-4 sm:px-6">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5 sm:mt-0">
              <User className="w-4 h-4" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-200">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 font-mono text-[10px] tracking-wide">
                  DEMO MODE ACTIVE
                </span>
                <span>Watching as Demo Student: Alex Sharma</span>
                <span className="hidden sm:inline text-indigo-400">·</span>
                <span className="hidden sm:inline font-normal text-slate-300">
                  2nd Year CSE · Skills: Python, C, HTML · Target: AI Engineer
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Explore how match scores (94%+), daily deadlines, and alerts are
                customized for Alex — then set up your own profile to get alerts
                for Hackathons, Internships, or Certifications.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={onOpenDemoWalkthrough}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Watch Demo Guide</span>
            </button>

            <button
              type="button"
              onClick={onOpenSetupProfile}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Set Up Your Profile & Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Active Custom Student Profile
  return (
    <aside aria-label="Active Profile Status" className="bg-emerald-950/90 text-emerald-100 border-b border-emerald-800/60 py-3 px-4 sm:px-6">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </span>
          <div className="text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              <span>Personalized for {profile.name}</span>
              <span className="text-emerald-400 font-normal">
                ({profile.degree} {profile.branch} · {profile.academicYear})
              </span>
            </div>
            <div className="text-[11px] text-emerald-200/80 flex flex-wrap items-center gap-1.5 mt-0.5">
              <Bell className="w-3 h-3 text-emerald-400 inline" />
              <span>
                Alerts active for:{' '}
                <strong>
                  {enabledAlerts.length > 0
                    ? enabledAlerts.join(', ')
                    : 'None selected'}
                </strong>
              </span>
              <span>· Target: {profile.careerGoal}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSetupProfile}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 transition-colors inline-flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" />
            <span>Edit Profile & Alerts</span>
          </button>
          <button
            type="button"
            onClick={onResetToDemo}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Switch to Demo Student</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
