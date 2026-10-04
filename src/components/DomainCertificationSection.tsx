import React, { useState } from 'react';
import {
  Award,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Filter,
  GraduationCap,
  Globe,
  Layers,
  ShieldCheck,
  Code2,
  Brain,
  Cloud,
  Terminal,
  Database,
  Lock,
} from 'lucide-react';
import {
  Opportunity,
  StudentProfile,
} from '../types/opportunity';
import {
  DOMAIN_CERTIFICATION_GROUPS,
  DomainCertificationGroup,
  ALL_CERTIFICATION_PORTALS,
  OfficialPortalLink,
} from '../data/initialData';
import { calculateMatchScore } from '../utils/matchingEngine';

interface DomainCertificationSectionProps {
  opportunities: Opportunity[];
  profile: StudentProfile;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetails: (opp: Opportunity) => void;
  activeDomain: string;
  onSelectDomain: (domain: string) => void;
}

export const DomainCertificationSection: React.FC<DomainCertificationSectionProps> = ({
  opportunities,
  profile,
  savedIds,
  onToggleSave,
  onOpenDetails,
  activeDomain,
  onSelectDomain,
}) => {
  const [costFilter, setCostFilter] = useState<'all' | 'free' | 'govt'>('all');

  // Filter certifications
  const certOpportunities = opportunities.filter(
    (o) => o.category === 'Certification'
  );

  const currentGroup: DomainCertificationGroup | undefined =
    DOMAIN_CERTIFICATION_GROUPS.find((g) => g.id === activeDomain);

  // Filter based on active domain
  const displayedCertifications = certOpportunities.filter((opp) => {
    // Domain match
    if (activeDomain !== 'All') {
      if (activeDomain === 'National & Govt Initiatives') {
        const isGovt =
          opp.tags?.some((t) =>
            ['Govt. of India', 'Skill India', 'National Digital Hub', 'IIT Certificate', 'College Credits'].includes(t)
          ) || ['Skill India Digital Hub', 'NASSCOM FutureSkills Prime', 'NPTEL (IIT / IISc)', 'SWAYAM'].includes(opp.organization);
        if (!isGovt) return false;
      } else if (opp.domain !== activeDomain) {
        return false;
      }
    }

    // Cost filter
    if (costFilter === 'free' && opp.cost !== 'Free') return false;
    if (costFilter === 'govt') {
      const isGovt =
        opp.tags?.some((t) =>
          ['Govt. of India', 'Skill India', 'National Digital Hub', 'IIT Certificate'].includes(t)
        ) || ['Skill India Digital Hub', 'NASSCOM FutureSkills Prime', 'NPTEL (IIT / IISc)', 'SWAYAM'].includes(opp.organization);
      if (!isGovt) return false;
    }

    return true;
  });

  const getDomainIcon = (id: string) => {
    switch (id) {
      case 'AI/ML':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'Web Development':
        return <Code2 className="w-4 h-4 text-emerald-600" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4 text-sky-600" />;
      case 'Data Science':
        return <Database className="w-4 h-4 text-indigo-600" />;
      case 'Cybersecurity':
        return <Lock className="w-4 h-4 text-rose-600" />;
      case 'Programming':
        return <Terminal className="w-4 h-4 text-amber-600" />;
      case 'National & Govt Initiatives':
        return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      default:
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Domain-Wise Certification Center</span>
            <span className="text-white/40">·</span>
            <span>20 Official Global & Indian Providers</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            Choose Your Technology Domain & Get Certified
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Direct enrollment into verified certifications from official portals including{' '}
            <strong className="text-white font-medium">Skill India Digital Hub</strong>,{' '}
            <strong className="text-white font-medium">NASSCOM FutureSkills Prime</strong>,{' '}
            <strong className="text-white font-medium">Infosys Springboard</strong>,{' '}
            <strong className="text-white font-medium">DeepLearning.AI</strong>,{' '}
            <strong className="text-white font-medium">Great Learning Academy</strong>,{' '}
            <strong className="text-white font-medium">Simplilearn SkillUP</strong>, and{' '}
            <strong className="text-white font-medium">Udemy</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Free Course Audit Options
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Government Accredited NSDC & MeitY Badges
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Official College Transfer Credits
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Domain Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Select Certification Domain</span>
            </h2>
            <p className="text-xs text-slate-500">
              Filter official certifications and direct provider links by specialized career domain:
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setCostFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                costFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setCostFilter('free')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                costFilter === 'free'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              100% Free Only
            </button>
            <button
              type="button"
              onClick={() => setCostFilter('govt')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                costFilter === 'govt'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Govt. Accredited
            </button>
          </div>
        </div>

        {/* Domain Selection Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
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
                {certOpportunities.length}
              </span>
            </div>
            <span className="text-xs font-bold leading-tight">All Domains</span>
          </button>

          {DOMAIN_CERTIFICATION_GROUPS.map((grp) => {
            const isSelected = activeDomain === grp.id;
            const countInDomain = certOpportunities.filter((o) => {
              if (grp.id === 'National & Govt Initiatives') {
                return (
                  o.tags?.some((t) =>
                    ['Govt. of India', 'Skill India', 'National Digital Hub', 'IIT Certificate'].includes(t)
                  ) || ['Skill India Digital Hub', 'NASSCOM FutureSkills Prime', 'NPTEL (IIT / IISc)', 'SWAYAM'].includes(o.organization)
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

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-medium text-slate-400">Core Skills:</span>
              {currentGroup.keySkills.slice(0, 4).map((sk) => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Platform Links for this Domain */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                <span>Direct Official Portal Links for {currentGroup.shortName}:</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Click any provider to apply directly
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
                    <span
                      className={`font-semibold ${
                        provider.free ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      {provider.free ? '✓ 100% Free / Audit' : 'Student Discount'}
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

      {/* Certifications Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            Available Certifications in {activeDomain === 'All' ? 'All Domains' : currentGroup?.shortName || activeDomain}:
          </div>
          <div className="font-mono tabular-nums text-slate-500">
            Showing <strong>{displayedCertifications.length}</strong> verified certifications
          </div>
        </div>

        {displayedCertifications.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              No certifications match the selected filter.
            </h4>
            <p className="text-xs text-slate-500">
              Try switching back to "All Domains" or clearing the Free / Govt. filter.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectDomain('All');
                setCostFilter('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedCertifications.map((opp) => {
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
                          <span>{opp.domain}</span>
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
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          opp.cost === 'Free'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opp.cost === 'Free' ? '100% Free' : 'Paid / Financial Aid'}
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
                      View Syllabus & Match
                    </button>

                    <a
                      href={opp.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold inline-flex items-center gap-1 shadow-xs transition-colors shrink-0"
                    >
                      <span>Start on Official Portal</span>
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
