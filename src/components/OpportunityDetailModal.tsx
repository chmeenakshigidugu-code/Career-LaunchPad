import React from 'react';
import {
  X,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Opportunity, StudentProfile, ApplicationStatus } from '../types/opportunity';
import {
  calculateMatchScore,
  getDynamicDeadlineInfo,
  isValidUrl,
} from '../utils/matchingEngine';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  profile: StudentProfile;
  isSaved: boolean;
  applicationStatus?: ApplicationStatus;
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'Saved',
  'Interested',
  'Applied',
  'Interviewing',
  'Accepted',
  'Rejected',
];

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  profile,
  isSaved,
  applicationStatus,
  onClose,
  onToggleSave,
  onUpdateStatus,
}) => {
  if (!opportunity) return null;

  const match = calculateMatchScore(profile, opportunity);
  const deadline = getDynamicDeadlineInfo(opportunity.deadlineDaysOffset);
  const validUrl = isValidUrl(opportunity.officialUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-indigo-600">
                {opportunity.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{opportunity.domain}</span>
              <span aria-hidden="true">·</span>
              {opportunity.verified ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Official Source
                </span>
              ) : (
                <span className="text-amber-700">Demo Listing</span>
              )}
              {opportunity.addedToday && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-700 font-bold inline-flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-indigo-600" />
                    Updated Today
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {opportunity.title}
            </h2>
            <p className="text-xs text-slate-600">
              Offered by{' '}
              <strong className="text-slate-800">
                {opportunity.organization}
              </strong>{' '}
              · {opportunity.location} ({opportunity.mode})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Match Score & Deadline Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Opportunity Match Score
                </span>
                <span className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">
                  {match.overall}% Match
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${match.overall}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Evaluated against {profile.degree} {profile.branch} (
                {profile.academicYear}) skills and preferences.
              </p>
            </div>

            <div className="space-y-1.5 md:border-l md:border-slate-200 md:pl-4 flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-600">
                Deadline Status (Updated Today)
              </span>
              <div className="flex items-center gap-2 font-mono tabular-nums text-base font-bold text-slate-900">
                {deadline.urgency === 'Urgent' ||
                deadline.urgency === 'Closing Soon' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                )}
                <span>
                  {deadline.urgency} · {deadline.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Official Deadline Date: {deadline.dateString}
              </p>
            </div>
          </div>

          {/* Why This Matches You */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Why this opportunity matches you
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {match.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="font-semibold text-slate-800 block mb-1">
                  Skills you have ({match.skillsHave.length}):
                </span>
                {match.skillsHave.length > 0 ? (
                  <p className="text-emerald-700 font-medium">
                    {match.skillsHave.map((s) => `✓ ${s}`).join(' · ')}
                  </p>
                ) : (
                  <p className="text-slate-400">None in your profile yet.</p>
                )}
              </div>

              <div>
                <span className="font-semibold text-slate-800 block mb-1">
                  Skills you can build ({match.skillsNeed.length}):
                </span>
                {match.skillsNeed.length > 0 ? (
                  <p className="text-amber-800">
                    {match.skillsNeed.map((s) => `○ ${s}`).join(' · ')}
                  </p>
                ) : (
                  <p className="text-emerald-700 font-medium">
                    You have all listed skills!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Full Details */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Opportunity Overview
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {opportunity.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
              <div>
                <span className="block text-slate-400">Eligibility</span>
                <span className="font-semibold text-slate-800">
                  {opportunity.eligibility}
                </span>
              </div>
              <div>
                <span className="block text-slate-400">Academic Years</span>
                <span className="font-semibold text-slate-800">
                  {opportunity.academicYears.join(', ')}
                </span>
              </div>
              <div>
                <span className="block text-slate-400">Mode & Location</span>
                <span className="font-semibold text-slate-800">
                  {opportunity.mode} · {opportunity.location}
                </span>
              </div>
              <div>
                <span className="block text-slate-400">Cost / Entry Fee</span>
                <span className="font-semibold text-slate-800">
                  {opportunity.cost}
                  {opportunity.registrationFeeText
                    ? ` (${opportunity.registrationFeeText})`
                    : ''}
                </span>
              </div>
              <div>
                <span className="block text-slate-400">
                  Compensation / Stipend
                </span>
                <span className="font-semibold text-slate-800">
                  {opportunity.stipend}
                </span>
              </div>
              <div>
                <span className="block text-slate-400">Duration</span>
                <span className="font-semibold text-slate-800">
                  {opportunity.duration}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="block text-slate-400">Official Portal URL</span>
                <span className="font-mono text-indigo-600 text-[11px] break-all">
                  {opportunity.officialUrl}
                </span>
              </div>
            </div>
          </div>

          {/* Tracker Status Selector */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-semibold text-slate-800 block">
                Update Application Pipeline Status
              </span>
              <span className="text-slate-500">Track your progress:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateStatus(opportunity.id, st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                    applicationStatus === st
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Application will continue directly on the official{' '}
            <strong>{opportunity.organization}</strong> portal.
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(opportunity.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                isSaved
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600' : ''}`}
              />
              <span>{isSaved ? 'Saved' : 'Save Opportunity'}</span>
            </button>

            {validUrl && (
              <a
                href={opportunity.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (!applicationStatus || applicationStatus === 'Saved') {
                    onUpdateStatus(opportunity.id, 'Interested');
                  }
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
