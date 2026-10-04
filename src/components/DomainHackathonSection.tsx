import React, { useState } from 'react';
import {
  Trophy,
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
  Award,
  Zap,
  Filter,
  Users,
  Search,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { Opportunity, StudentProfile } from '../types/opportunity';
import {
  DOMAIN_HACKATHON_GROUPS,
  DomainHackathonGroup,
  ALL_HACKATHON_PORTALS,
} from '../data/initialData';
import { calculateMatchScore } from '../utils/matchingEngine';

interface DomainHackathonSectionProps {
  opportunities: Opportunity[];
  profile: StudentProfile;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetails: (opp: Opportunity) => void;
  activeDomain: string;
  onSelectDomain: (domain: string) => void;
}

export const DomainHackathonSection: React.FC<DomainHackathonSectionProps> = ({
  opportunities,
  profile,
  savedIds,
  onToggleSave,
  onOpenDetails,
  activeDomain,
  onSelectDomain,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'hybrid' | 'ppi'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter hackathon & competition opportunities
  const hackathonOpportunities = opportunities.filter(
    (o) => o.category === 'Hackathon' || o.category === 'Competition'
  );

  const currentGroup: DomainHackathonGroup | undefined =
    DOMAIN_HACKATHON_GROUPS.find((g) => g.id === activeDomain);

  // Filter based on active domain, filterMode, and search query
  const displayedHackathons = hackathonOpportunities.filter((opp) => {
    // 1. Domain Match
    if (activeDomain !== 'All') {
      if (activeDomain === 'Enterprise & Hiring') {
        const isEnterprise =
          opp.domain === 'Software Engineering' ||
          opp.domain === 'Programming' ||
          ['Flipkart GRiD (Unstop)', 'Infosys (HackWithInfy)', 'Tata Consultancy Services (TCS)', 'Mahindra Rise / Tech Mahindra', 'Unstop'].includes(opp.organization);
        const matchesTags = opp.tags?.some((t) =>
          ['Flipkart GRiD', 'SDE-1 PPIs', 'Specialist Programmer', 'TCS CodeVita', 'Tech Mahindra', 'Hiring Challenges'].includes(t)
        );
        if (!isEnterprise && !matchesTags) return false;
      } else if (activeDomain === 'Big Tech & Global') {
        const isBigTech =
          ['Microsoft Imagine Cup', 'Google Developer Community', 'Amazon Web Services (AWS)', 'Devpost', 'Major League Hacking (MLH)'].includes(opp.organization) ||
          opp.tags?.some((t) => ['Imagine Cup', 'Google GDSC', 'AWS Official', 'Global League'].includes(t));
        if (!isBigTech) return false;
      } else if (activeDomain === 'AI/ML & Data Sprints') {
        const isAIML =
          opp.domain === 'AI/ML' ||
          opp.domain === 'Data Science' ||
          ['Amazon ML Challenge (Unstop)', 'Reliance Jio / Jio Institute', 'Kaggle Competitions', 'DoraHacks'].includes(opp.organization);
        if (!isAIML) return false;
      } else if (activeDomain === 'Coding Contests & DSA') {
        const isCoding =
          opp.domain === 'Programming' ||
          ['GeeksforGeeks', 'Coding Ninjas', 'Code360 (Naukri / CodeStudio)', 'HackerEarth'].includes(opp.organization);
        if (!isCoding) return false;
      } else if (activeDomain === 'Cybersecurity & CTF') {
        const isCyber =
          opp.domain === 'Cybersecurity' ||
          opp.organization.includes('Hack The Box') ||
          opp.tags?.some((t) => t.toLowerCase().includes('ctf') || t.toLowerCase().includes('cyber'));
        if (!isCyber) return false;
      } else if (activeDomain === 'National & Flagship') {
        const isNational =
          opp.tags?.some((t) => ['National Government', 'Flagship', 'National Flagship', 'Community Hacks'].includes(t)) ||
          ['Smart India Hackathon (Govt. of India)', 'Devfolio', 'Hack2skill', 'Hackathon.com'].includes(opp.organization);
        if (!isNational) return false;
      }
    }

    // 2. Mode / PPI Filter
    if (filterMode === 'online' && opp.mode !== 'Online') return false;
    if (filterMode === 'hybrid' && opp.mode !== 'Hybrid' && opp.mode !== 'Offline') return false;
    if (filterMode === 'ppi') {
      const hasPPI =
        opp.stipend.toLowerCase().includes('ppi') ||
        opp.stipend.toLowerCase().includes('interview') ||
        opp.stipend.toLowerCase().includes('hiring') ||
        opp.stipend.toLowerCase().includes('job offer') ||
        opp.tags?.some((t) => t.toLowerCase().includes('ppi') || t.toLowerCase().includes('hiring'));
      if (!hasPPI) return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.eligibility.toLowerCase().includes(q) ||
        opp.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    return true;
  });

  const getDomainIcon = (id: string) => {
    switch (id) {
      case 'Enterprise & Hiring':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'Big Tech & Global':
        return <Globe className="w-4 h-4 text-indigo-600" />;
      case 'AI/ML & Data Sprints':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'Coding Contests & DSA':
        return <Terminal className="w-4 h-4 text-amber-600" />;
      case 'Cybersecurity & CTF':
        return <ShieldCheck className="w-4 h-4 text-rose-600" />;
      case 'National & Flagship':
        return <Building2 className="w-4 h-4 text-sky-600" />;
      default:
        return <Trophy className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800/40 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-indigo-300" />
            <span>Domain-Wise National & Global Hackathons</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-[11px]">23 Official Portals Live</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Choose Your Hackathon Domain, View Online/Offline Mode & Verified Eligibility
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Explore verified corporate hiring hackathons (Flipkart GRiD, HackWithInfy, TCS CodeVita), Big Tech challenges (Microsoft Imagine Cup, Google Solution Challenge, AWS), AI sprints (Amazon ML Challenge, Jio Institute), and competitive coding events (GeeksforGeeks, Coding Ninjas, Code360). Every opportunity specifies exact <strong>Online vs. Offline mode</strong> and official <strong>degree & year eligibility</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Online Virtual:</strong> 21 Portals</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span><strong>Hybrid / Campus:</strong> 2 Portals</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span><strong>Pre-Placement Interviews (PPIs):</strong> Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Selection Tabs Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Select Domain Track
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {hackathonOpportunities.length} Verified Hackathons Across {DOMAIN_HACKATHON_GROUPS.length} Domain Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {/* "All" button */}
          <button
            type="button"
            onClick={() => onSelectDomain('All')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              activeDomain === 'All'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Trophy className={`w-4 h-4 ${activeDomain === 'All' ? 'text-white' : 'text-indigo-600'}`} />
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  activeDomain === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {hackathonOpportunities.length}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold">All Hackathons</div>
              <div className={`text-[10px] truncate ${activeDomain === 'All' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Complete Catalog
              </div>
            </div>
          </button>

          {/* Domain Category Buttons */}
          {DOMAIN_HACKATHON_GROUPS.map((group) => {
            const isSelected = activeDomain === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectDomain(group.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  {isSelected ? (
                    <Trophy className="w-4 h-4 text-white" />
                  ) : (
                    getDomainIcon(group.id)
                  )}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[80px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {group.badge.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold truncate">{group.shortName}</div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {group.recommendedProviders.length} Portals
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Domain Showcase Banner */}
      {currentGroup && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                  {getDomainIcon(currentGroup.id)}
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  {currentGroup.name}
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
                  {currentGroup.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {currentGroup.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Participation Mode</div>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentGroup.modeOverview}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Prizes & Benefits</div>
                <div className="text-xs font-bold text-indigo-700 flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{currentGroup.prizeNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility & Skills Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/80">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Eligibility Criteria:</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {currentGroup.eligibilitySummary}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Core Recommended Skills:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentGroup.keySkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2 py-0.5 bg-white border border-indigo-200 text-indigo-800 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Direct Platform Links Chips */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Direct Official Portals ({currentGroup.recommendedProviders.length}):</span>
              <span className="text-[11px] text-slate-500 font-normal">Click to visit official registration page</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {currentGroup.recommendedProviders.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm rounded-xl transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                        <span>{provider.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {provider.highlights}
                      </div>
                    </div>
                    {provider.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {provider.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[10px]">
                    <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                      {provider.mode === 'Online' ? (
                        <Globe className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Building2 className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{provider.mode}</span>
                    </span>
                    <span className="text-indigo-600 font-bold truncate max-w-[140px]">
                      {provider.prizePool}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Filter Mode:
          </span>

          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Modes ({hackathonOpportunities.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('online')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1 ${
              filterMode === 'online'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Online Virtual Only</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('hybrid')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1 ${
              filterMode === 'hybrid'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hybrid / Campus Track</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('ppi')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1 ${
              filterMode === 'ppi'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Pre-Placement Interviews (PPIs)</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, skills, eligibility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Hackathon Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>
            Showing <strong>{displayedHackathons.length}</strong> Hackathons
            {activeDomain !== 'All' ? ` in ${activeDomain}` : ''}
          </span>
          <span>Verified & Safe · Real URLs</span>
        </div>

        {displayedHackathons.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No hackathons found matching your filter criteria.
            </h3>
            <p className="text-xs text-slate-500">
              Try switching your mode filter to "All Modes" or clearing the search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterMode('all');
                setSearchQuery('');
                onSelectDomain('All');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedHackathons.map((opp) => {
              const isSaved = savedIds.includes(opp.id);
              const matchResult = calculateMatchScore(profile, opp);
              const score = matchResult.overall;

              return (
                <div
                  key={opp.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Row: Category, Mode & Match */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Mode badge: Online vs Hybrid */}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            opp.mode === 'Online'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {opp.mode === 'Online' ? (
                            <Globe className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Building2 className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{opp.mode}</span>
                        </span>

                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {opp.domain}
                        </span>

                        {opp.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-500">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      {/* Match Score Badge */}
                      <div
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${
                          score >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : score >= 60
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                        title={matchResult.reasons.join(' · ')}
                      >
                        <Zap className="w-3 h-3" />
                        <span>{score}% Match</span>
                      </div>
                    </div>

                    {/* Title & Organization */}
                    <div>
                      <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                        {opp.organization}
                      </div>
                      <h3
                        onClick={() => onOpenDetails(opp)}
                        className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer mt-0.5"
                      >
                        {opp.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Prominent Eligibility Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-indigo-600" />
                        <span>Verified Eligibility:</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-800 line-clamp-2">
                        {opp.eligibility}
                      </div>
                    </div>

                    {/* Prizes & Deadlines */}
                    <div className="space-y-1.5 text-xs pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Prize / Reward:</span>
                        <span className="font-bold text-indigo-600 text-right truncate max-w-[180px]">
                          {opp.stipend}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Timeline / Batch:</span>
                        <span className="font-semibold text-slate-700">{opp.eventDateText}</span>
                      </div>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {opp.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {opp.skills.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">
                          +{opp.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleSave(opp.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Hackathon'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDetails(opp)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      View Details
                    </button>

                    <a
                      href={opp.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Official Register</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Complete Official Hackathon Portals Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Complete Directory of 23 Official Hackathon & Competition Platforms</span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified safe destination URLs with participation modes and eligibility rules.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            All 23 Verified Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">Platform / Competition</th>
                <th className="py-2.5 px-3">Domain Category</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Verified Eligibility</th>
                <th className="py-2.5 px-3 text-right">Official Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ALL_HACKATHON_PORTALS.map((portal) => (
                <tr key={portal.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{portal.name}</span>
                      {portal.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {portal.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                      {portal.note}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                    {portal.domain}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        portal.mode === 'Online'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {portal.mode === 'Online' ? (
                        <Globe className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Building2 className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{portal.mode}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">
                    {portal.eligibility}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
