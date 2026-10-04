import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bell,
  Clock,
  ExternalLink,
  Code,
  Briefcase,
  Award,
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSetupProfile: () => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onStartSetupProfile,
}) => {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: '1. Meet Demo Student: Alex Sharma',
      badge: 'Academic & Career Setup',
      desc: 'See how Demo Student is configured as a 2nd Year Computer Science student aiming for an AI Engineer role.',
    },
    {
      step: 2,
      title: '2. Transparent Opportunity Match Score',
      badge: 'Skill-Based Recommendations',
      desc: 'Alex knows Python, C, and HTML. Opportunities in AI/ML immediately show 90%+ match scores with transparent reasons.',
    },
    {
      step: 3,
      title: '3. Everyday Deadlines & Direct Apply',
      badge: 'Rolling Daily Feed',
      desc: 'Dates are updated every day so deadlines are always accurate. Students apply directly on Devpost, Internshala, and Google without middlemen.',
    },
    {
      step: 4,
      title: '4. Tailored Alerts for What YOU Want',
      badge: 'Notifications Control',
      desc: 'Choose exactly what to be notified about: Hackathons, Internships, or Certifications with deadline protection warnings.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold font-display">
                Demo Student Experience Tour
              </h2>
              <p className="text-xs text-slate-300">
                Learn how Career Launchpad personalizes opportunities before setting up your own profile.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Tour"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs text-center font-semibold">
          {steps.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`py-2.5 px-2 transition-colors border-b-2 ${
                activeStep === s.step
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Step {s.step}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-5">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Alex Sharma's Preloaded Student Profile
                </h3>
                <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  2nd Year B.Tech CSE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Degree & College</span>
                  <span className="font-semibold text-slate-800">
                    B.Tech CSE · NIT Trichy
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Career Goal</span>
                  <span className="font-semibold text-indigo-700">
                    AI Engineer
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Validated Skills</span>
                  <span className="font-semibold text-slate-800">
                    Python, C, HTML, SQL, Git
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Domain Interests</span>
                  <span className="font-semibold text-slate-800">
                    AI/ML, Web Development, Cloud
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                By knowing Alex's branch, academic year, and verified skills, the platform calculates match scores across all 40+ official opportunities.
              </p>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Personalized Matching in Action
              </h3>
              <p className="text-xs text-slate-600">
                Because Alex knows Python and aims for AI Engineer, here is what Alex sees:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Global AI & Cloud Hackathon (Devpost)
                    </span>
                    <span className="text-emerald-700 font-medium">
                      ✓ Matches Python & HTML · 2nd Year Eligible
                    </span>
                  </div>
                  <span className="text-emerald-800 font-mono font-bold text-sm">
                    95% Match
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Python for Data Science & AI (NPTEL / IIT Madras)
                    </span>
                    <span className="text-emerald-700 font-medium">
                      ✓ Free verified course · Credit eligible
                    </span>
                  </div>
                  <span className="text-emerald-800 font-mono font-bold text-sm">
                    96% Match
                  </span>
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Python Virtual Internship (Internshala)
                    </span>
                    <span className="text-indigo-700 font-medium">
                      ✓ ₹15,000/mo Stipend · Remote
                    </span>
                  </div>
                  <span className="text-indigo-800 font-mono font-bold text-sm">
                    89% Match
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Everyday Rolling Deadlines & Official Links
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opportunities are updated everyday. The platform warns students when a deadline is closing tomorrow or this week:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-amber-800 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Closing Soon Alerts</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Automatic warnings 1–2 days before registration closes so you never miss an opportunity.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-indigo-800 font-bold">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Direct Official Apply</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    No middlemen or fake forms. 1-click redirect to Devpost, Internshala, Google, and NPTEL.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Tailor Notifications to What YOU Want
              </h3>
              <p className="text-xs text-slate-600">
                You can specify exactly which opportunity categories you want notifications for:
              </p>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50">
                  <Code className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block">Hackathons</span>
                  <span className="text-[11px] text-slate-500">SIH, Devpost, MLH</span>
                </div>

                <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50">
                  <Briefcase className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block">Internships</span>
                  <span className="text-[11px] text-slate-500">Stipends, GSoC, AICTE</span>
                </div>

                <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50">
                  <Award className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block">Certifications</span>
                  <span className="text-[11px] text-slate-500">Google, NPTEL, AWS</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Step {activeStep} of 4
          </div>

          <div className="flex items-center gap-2">
            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartSetupProfile();
                }}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Setup My Own Profile & Alerts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
