import React from 'react';
import {
  Bookmark,
  ExternalLink,
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

interface OpportunityCardProps {
  opportunity: Opportunity;
  profile: StudentProfile;
  isSaved: boolean;
  applicationStatus?: ApplicationStatus;
  onToggleSave: (id: string) => void;
  onOpenDetails: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  profile,
  isSaved,
  applicationStatus,
  onToggleSave,
  onOpenDetails,
}) => {
  const match = calculateMatchScore(profile, opportunity);
  const deadline = getDynamicDeadlineInfo(opportunity.deadlineDaysOffset);
  const validUrl = isValidUrl(opportunity.officialUrl);

  const getUrgencyColor = () => {
    switch (deadline.urgency) {
      case 'Urgent':
        return 'text-rose-700 font-semibold';
      case 'Closing Soon':
        return 'text-amber-700 font-semibold';
      case 'Upcoming':
        return 'text-indigo-700 font-medium';
      case 'Rolling':
        return 'text-emerald-700 font-medium';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors flex flex-col justify-between gap-4 shadow-xs">
      <div className="space-y-3">
        {/* Unboxed Metadata Line per Zero-Pill Constitution */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-700">
              {opportunity.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.domain}</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.mode}</span>
            <span aria-hidden="true">·</span>
            {opportunity.verified ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Source
              </span>
            ) : (
              <span className="text-amber-700">Demo Listing</span>
            )}
            {opportunity.addedToday && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-indigo-700 font-bold">
                  <Flame className="w-3 h-3 text-indigo-600" />
                  Updated Today
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 font-mono tabular-nums">
            <span
              className={`text-sm font-bold ${
                match.overall >= 85
                  ? 'text-emerald-700'
                  : match.overall >= 70
                  ? 'text-indigo-700'
                  : 'text-slate-700'
              }`}
            >
              {match.overall}% Match
            </span>
          </div>
        </div>

        {/* Title & Organization */}
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            <button
              type="button"
              onClick={() => onOpenDetails(opportunity)}
              className="text-left hover:text-indigo-600 transition-colors"
            >
              {opportunity.title}
            </button>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {opportunity.organization} · {opportunity.location}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {opportunity.description}
        </p>

        {/* Structured Key Facts */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <span className="block text-[11px] text-slate-400">
              {opportunity.category === 'Internship'
                ? 'Compensation'
                : 'Cost / Value'}
            </span>
            <span className="font-semibold text-slate-800">
              {opportunity.stipend}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400">Eligibility</span>
            <span className="font-medium text-slate-800">
              {opportunity.difficulty} ·{' '}
              {opportunity.academicYears.length >= 4
                ? '1st–4th Year'
                : opportunity.academicYears.join(', ')}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[11px] text-slate-400">Deadline Status</span>
            <span
              className={`inline-flex items-center gap-1 font-mono tabular-nums ${getUrgencyColor()}`}
            >
              {deadline.urgency === 'Urgent' ||
              deadline.urgency === 'Closing Soon' ? (
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              ) : (
                <Clock className="w-3.5 h-3.5 shrink-0" />
              )}
              {deadline.label}
            </span>
          </div>
        </div>

        {/* Skills Tag Line */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
          <span className="text-slate-400">Skills:</span>
          {opportunity.skills.map((skill, idx) => {
            const hasSkill = match.skillsHave.includes(skill);
            return (
              <React.Fragment key={skill}>
                <span
                  className={
                    hasSkill
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-600'
                  }
                >
                  {hasSkill ? `✓ ${skill}` : skill}
                </span>
                {idx < opportunity.skills.length - 1 && (
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenDetails(opportunity)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Match & Details
          </button>

          <button
            type="button"
            onClick={() => onToggleSave(opportunity.id)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1 whitespace-nowrap ${
              isSaved
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600' : ''}`}
            />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {applicationStatus && (
            <span className="text-[11px] text-slate-500 font-mono">
              Status: {applicationStatus}
            </span>
          )}
        </div>

        {validUrl ? (
          <a
            href={opportunity.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Apply on Official Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs text-rose-600 font-medium">Link Unavailable</span>
        )}
      </div>
    </article>
  );
};
