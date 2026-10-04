import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  Lock,
  Cookie,
  Award,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';

interface LegalPrivacyModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms' | 'cookies' | 'copyright';
  onClose: () => void;
  onOpenReportModal: () => void;
}

export const LegalPrivacyModal: React.FC<LegalPrivacyModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
  onOpenReportModal,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies' | 'copyright'>(
    initialTab
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Legal, Privacy & Ownership Protection</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clear terms, privacy guarantees, and open-source license notices.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-center">
          {[
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Use' },
            { id: 'cookies', label: 'Cookie Policy' },
            { id: 'copyright', label: 'Ownership' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 px-2 transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed overflow-y-auto">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  1. Privacy Policy for Career Launchpad
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Effective Date: October 2, 2026 · Local-First Architecture
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800">1.1 Information Collected</h4>
                  <p>
                    Career Launchpad only processes data that you voluntarily enter
                    into your student profile: your name, college, degree, branch,
                    academic year, target career goal, and technical skills. We do
                    not collect sensitive biometric, financial, or private telemetry
                    data.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">1.2 Local Storage & No Tracking</h4>
                  <p>
                    All profile configurations, saved opportunities, and application
                    pipeline tracking statuses are stored locally on your device via
                    standard browser storage. No identifying profile data is sold,
                    leased, or shared with commercial data brokers or ad platforms.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">1.3 Third-Party External Websites</h4>
                  <p>
                    When you click "Apply on Official Website", you leave Career
                    Launchpad and navigate directly to third-party providers (e.g.,
                    Devpost, Google Careers, Internshala, NPTEL). Each provider
                    operates under its own privacy policy. We encourage you to
                    review their respective privacy notices upon arrival.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">1.4 Data Deletion Rights</h4>
                  <p>
                    You retain complete autonomy over your data. You may reset or
                    delete your saved bookmarks, profile information, and application
                    history at any time by clearing your browser cache or switching
                    back to Demo Student mode.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  2. Terms of Use
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Governing Use of Career Launchpad
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800">2.1 Directory & Intelligence Service</h4>
                  <p>
                    Career Launchpad provides an aggregated informational directory
                    and rule-based recommendation tool. We do not host or adjudicate
                    hackathon competitions, academic grading, or corporate employment
                    decisions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">2.2 Accuracy & External Changes</h4>
                  <p>
                    While we verify official URLs and deadlines on a daily basis,
                    third-party organizers (such as MLH, Google, or university
                    departments) may adjust prize pools, deadlines, or eligibility
                    rules at their discretion. Official platform websites always serve
                    as the final authority.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">2.3 Acceptable Use</h4>
                  <p>
                    You agree not to execute automated scrapers, denial-of-service
                    attacks, or penetration attempts against this platform. All
                    security vulnerabilities should be reported responsibly through
                    our designated reporting channel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  3. Cookie & Client Storage Policy
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Transparent Disclosure of Device Storage
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800">3.1 Zero Third-Party Advertising Cookies</h4>
                  <p>
                    Career Launchpad does not deploy third-party advertising cookies,
                    retargeting pixels, or behavioral tracking beacons.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">3.2 Functional Browser Storage</h4>
                  <p>
                    We strictly use client-side browser storage (localStorage) for
                    essential functional requirements:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-600">
                    <li>
                      <strong>Profile Preferences:</strong> Storing your selected
                      academic year and skills to compute match scores.
                    </li>
                    <li>
                      <strong>Application Tracker:</strong> Preserving your personal
                      pipeline statuses (e.g. Applied, Interviewing).
                    </li>
                    <li>
                      <strong>Rate Limiter:</strong> Enforcing request quotas to
                      prevent automated denial of service.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  4. Intellectual Property, Ownership & Trademark Attribution
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Honest Attribution & License Respect
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800">4.1 Original Platform Code & UI</h4>
                  <p>
                    The original web codebase, user experience design, algorithmic
                    opportunity matching engine, and styling of Career Launchpad are
                    the intellectual property of the author (© 2026 Career
                    Launchpad. All rights reserved).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">4.2 Third-Party Trademarks & Portals</h4>
                  <p>
                    All third-party platform names, company names, and institutional
                    marks mentioned on this website (including but not limited to{' '}
                    <em>
                      Devpost, Unstop, Devfolio, HackerEarth, Major League Hacking,
                      Google, Microsoft, AWS, NPTEL, SWAYAM, Coursera, edX,
                      freeCodeCamp, Kaggle, Cisco, Oracle, GitHub, Skill India Digital Hub,
                      NASSCOM FutureSkills Prime, Infosys Springboard, Great Learning,
                      Simplilearn, DeepLearning.AI, Udemy, Internshala,
                      LinkedIn, AICTE, Wellfound, LFX, Outreachy
                    </em>
                    ) are the registered trademarks of their respective owners. Their
                    use here is strictly descriptive for educational identification
                    under nominative fair use.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">4.3 Open Source Dependencies</h4>
                  <p>
                    Career Launchpad is built using open-source libraries (React,
                    Vite, Tailwind CSS, Lucide Icons) in compliance with their
                    respective MIT and Apache 2.0 open-source licenses.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReportModal();
            }}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold inline-flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Report a Security or Legal Concern</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
