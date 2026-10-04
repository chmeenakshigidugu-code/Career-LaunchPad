import React, { useState } from 'react';
import {
  Briefcase,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Building2,
  Globe,
  Layers,
  ShieldCheck,
  Code2,
  GraduationCap,
  FlaskConical,
  Award,
  Zap,
} from 'lucide-react';
import {
  Opportunity,
  StudentProfile,
} from '../types/opportunity';
import {
  DOMAIN_INTERNSHIP_GROUPS,
  DomainInternshipGroup,
  ALL_INTERNSHIP_PORTALS,
} from '../data/initialData';
import { calculateMatchScore } from '../utils/matchingEngine';

interface DomainInternshipSectionProps {
  opportunities: Opportunity[];
  profile: StudentProfile;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetails: (opp: Opportunity) => void;
  activeDomain: string;
  onSelectDomain: (domain: string) => void;
}

export const DomainInternshipSection: React.FC<DomainInternshipSectionProps> = ({
  opportunities,
  profile,
  savedIds,
  onToggleSave,
  onOpenDetails,
  activeDomain,
  onSelectDomain,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'high_stipend' | 'govt' | 'remote'>('all');

  // Filter internship & fellowship opportunities
  const internshipOpportunities = opportunities.filter(
    (o) => o.category === 'Internship' || o.category === 'Fellowship'
  );

  const currentGroup: DomainInternshipGroup | undefined =
    DOMAIN_INTERNSHIP_GROUPS.find((g) => g.id === activeDomain);

  // Filter based on active domain & filterType
  const displayedInternships = internshipOpportunities.filter((opp) => {
    // 1. Domain Match
    if (activeDomain !== 'All') {
      if (activeDomain === 'Big Tech') {
        const isBigTech =
          opp.domain === 'Big Tech' ||
          ['Google Student Careers', 'Google Build Your Future', 'Microsoft University Recruiting', 'Amazon Student Programs', 'Meta University Careers', 'Apple Internships', 'NVIDIA University Recruiting', 'Adobe University Recruiting'].includes(opp.organization);
        if (!isBigTech) return false;
      } else if (activeDomain === 'Govt & National Schemes') {
        const isGovt =
          opp.domain === 'Govt & National Schemes' ||
          opp.tags?.some((t) => ['Govt. of India', 'MCA Flagship', 'Skill India', 'National Career Service', 'AICTE'].includes(t));
        if (!isGovt) return false;
      } else if (activeDomain === 'Research Fellowships') {
        const isResearch =
          opp.domain === 'Research Fellowships' ||
          opp.category === 'Fellowship' ||
          ['Indian Academy of Sciences', 'IIT Bombay & IIT Research Consortia', 'LFX Mentorship (Linux Foundation)', 'Google Summer of Code'].includes(opp.organization);
        if (!isResearch) return false;
      } else if (activeDomain === 'Software Engineering') {
        const isSWE =
          opp.domain === 'Software Engineering' ||
          opp.domain === 'Web Development' ||
          ['Internshala', 'Wellfound', 'MLH Fellowship', 'Internships.com', 'Youth4Work'].includes(opp.organization);
        if (!isSWE) return false;
      } else if (activeDomain === 'Campus & Corporate') {
        const isCampus =
          opp.domain === 'Campus & Corporate' ||
          ['Naukri Campus', 'Indeed', 'Unstop Internships', 'LinkedIn'].includes(opp.organization);
        if (!isCampus) return false;
      } else if (activeDomain === 'Global Diversity') {
        const isDiversity =
          opp.domain === 'Global Diversity' ||
          ['Outreachy', 'MLH Fellowship', 'LFX Mentorship'].includes(opp.organization);
        if (!isDiversity) return false;
      }
    }

    // 2. Secondary Filter
    if (filterType === 'remote' && opp.mode !== 'Online') return false;
    if (filterType === 'govt') {
      const isGovt =
        opp.domain === 'Govt & National Schemes' ||
        opp.tags?.some((t) => ['Govt. of India', 'MCA Flagship', 'Skill India', 'National Career Service'].includes(t));
      if (!isGovt) return false;
    }
    if (filterType === 'high_stipend') {
      const isHigh =
        opp.stipend.includes('₹75,000') ||
        opp.stipend.includes('₹85,000') ||
        opp.stipend.includes('₹95,000') ||
        opp.stipend.includes('₹1,00,000') ||
        opp.stipend.includes('₹1,10,000') ||
        opp.stipend.includes('₹1,20,000') ||
        opp.stipend.includes('$');
      if (!isHigh) return false;
    }

    return true;
  });

  const getDomainIcon = (id: string) => {
    switch (id) {
      case 'Big Tech':
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case 'Govt & National Schemes':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'Research Fellowships':
        return <FlaskConical className="w-4 h-4 text-amber-600" />;
      case 'Software Engineering':
        return <Code2 className="w-4 h-4 text-sky-600" />;
      case 'Campus & Corporate':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'Global Diversity':
        return <Globe className="w-4 h-4 text-rose-600" />;
      default:
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Domain-Wise Internship Center</span>
            <span className="text-white/40">·</span>
            <span>26 Official Global & Indian Portals</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            Explore Internships by Career Domain & Direct Employer Portals
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Apply directly to verified internship drives across{' '}
            <strong className="text-white font-medium">Big Tech & MAANG Programs</strong> (Google STEP, Microsoft, Amazon, Meta, Apple, NVIDIA, Adobe),{' '}
            <strong className="text-white font-medium">Govt Schemes</strong> (PM Internship Scheme, NCS, Skill India Digital Hub),{' '}
            <strong className="text-white font-medium">Research Fellowships</strong> (IASc Summer Research, IIT Bombay), and{' '}
            <strong className="text-white font-medium">Direct Hiring Portals</strong> (Indeed, Naukri Campus, Internships.com, Youth4Work, Internshala).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Guaranteed Monthly Stipends
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pre-Placement Return Offers (PPOs)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct Official Platform Applications
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Domain Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Select Internship Domain</span>
            </h2>
            <p className="text-xs text-slate-500">
              Filter official internships and direct employer portals by specialized domain:
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('high_stipend')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'high_stipend'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Stipend ≥ ₹75k / mo
            </button>
            <button
              type="button"
              onClick={() => setFilterType('govt')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'govt'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Govt Schemes
            </button>
            <button
              type="button"
              onClick={() => setFilterType('remote')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'remote'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Remote / Online
            </button>
          </div>
        </div>

        {/* Domain Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <button
            type="button"
            onClick={() => onSelectDomain('All')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
              activeDomain === 'All'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-600 shadow-xs'
                : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                {internshipOpportunities.length}
              </span>
            </div>
            <span className="text-xs font-bold leading-tight">All Domains</span>
          </button>

          {DOMAIN_INTERNSHIP_GROUPS.map((grp) => {
            const isSelected = activeDomain === grp.id;
            const countInDomain = internshipOpportunities.filter((o) => {
              if (grp.id === 'Big Tech') {
                return (
                  o.domain === 'Big Tech' ||
                  ['Google Student Careers', 'Google Build Your Future', 'Microsoft University Recruiting', 'Amazon Student Programs', 'Meta University Careers', 'Apple Internships', 'NVIDIA University Recruiting', 'Adobe University Recruiting'].includes(o.organization)
                );
              }
              if (grp.id === 'Govt & National Schemes') {
                return (
                  o.domain === 'Govt & National Schemes' ||
                  o.tags?.some((t) => ['Govt. of India', 'MCA Flagship', 'Skill India', 'National Career Service'].includes(t))
                );
              }
              if (grp.id === 'Research Fellowships') {
                return (
                  o.domain === 'Research Fellowships' ||
                  o.category === 'Fellowship' ||
                  ['Indian Academy of Sciences', 'IIT Bombay & IIT Research Consortia', 'LFX Mentorship (Linux Foundation)', 'Google Summer of Code'].includes(o.organization)
                );
              }
              if (grp.id === 'Software Engineering') {
                return (
                  o.domain === 'Software Engineering' ||
                  o.domain === 'Web Development' ||
                  ['Internshala', 'Wellfound', 'MLH Fellowship', 'Internships.com', 'Youth4Work'].includes(o.organization)
                );
              }
              if (grp.id === 'Campus & Corporate') {
                return (
                  o.domain === 'Campus & Corporate' ||
                  ['Naukri Campus', 'Indeed', 'Unstop Internships', 'LinkedIn'].includes(o.organization)
                );
              }
              if (grp.id === 'Global Diversity') {
                return (
                  o.domain === 'Global Diversity' ||
                  ['Outreachy', 'MLH Fellowship', 'LFX Mentorship'].includes(o.organization)
                );
              }
              return o.domain === grp.id;
            }).length;

            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => onSelectDomain(grp.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-600 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  {getDomainIcon(grp.id)}
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    {countInDomain}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold leading-tight block truncate">
                    {grp.shortName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">
                    {grp.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain Focus Banner with Direct Portal Links */}
      {currentGroup && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50">
                  {getDomainIcon(currentGroup.id)}
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {currentGroup.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                  {currentGroup.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {currentGroup.description}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1 shrink-0">
              <span className="text-[11px] font-medium text-slate-400">Typical Stipend:</span>
              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {currentGroup.stipendNote}
              </span>
            </div>
          </div>

          {/* Direct Platform Links for this Domain */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                <span>Direct Application Portals for {currentGroup.shortName}:</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Click to apply directly on verified employer portal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {currentGroup.recommendedProviders.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-xs group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {provider.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {provider.highlights}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                    <span className="font-semibold text-emerald-700 font-mono">
                      {provider.stipendRange}
                    </span>
                    {provider.badge && (
                      <span className="font-mono text-slate-400">{provider.badge}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Internships Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            Available Internships in {activeDomain === 'All' ? 'All Domains' : currentGroup?.shortName || activeDomain}:
          </div>
          <div className="font-mono tabular-nums text-slate-500">
            Showing <strong>{displayedInternships.length}</strong> verified opportunities
          </div>
        </div>

        {displayedInternships.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              No internships match the selected filter.
            </h4>
            <p className="text-xs text-slate-500">
              Try switching back to "All Domains" or clearing the secondary stipend/remote filter.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectDomain('All');
                setFilterType('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedInternships.map((opp) => {
              const match = calculateMatchScore(profile, opp);
              const isSaved = savedIds.includes(opp.id);

              return (
                <div
                  key={opp.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                          <span className="font-semibold text-indigo-600">
                            {opp.organization}
                          </span>
                          <span>·</span>
                          <span>{opp.location}</span>
                        </div>
                        <h4
                          onClick={() => onOpenDetails(opp)}
                          className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
                        >
                          {opp.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSave(opp.id)}
                        className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                          isSaved
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                        title={isSaved ? 'Saved in Watchlist' : 'Save to Watchlist'}
                      >
                        <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Match Score & Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {match.overall}% Match
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {opp.stipend}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {opp.duration}
                      </span>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap items-center gap-1">
                      {opp.skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(opp)}
                      className="text-slate-600 hover:text-indigo-600 font-semibold"
                    >
                      View Role Details
                    </button>

                    <a
                      href={opp.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold inline-flex items-center gap-1 shadow-xs transition-colors shrink-0"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
