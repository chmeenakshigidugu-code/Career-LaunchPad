import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Bell,
  Code,
  Briefcase,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Mail,
  Clock,
  Plus,
} from 'lucide-react';
import { StudentProfile, NotificationPreferences } from '../types/opportunity';

interface SetupProfileModalProps {
  isOpen: boolean;
  currentProfile: StudentProfile;
  onClose: () => void;
  onCompleteProfile: (newProfile: StudentProfile) => void;
}

const POPULAR_SKILLS = [
  'Python',
  'C',
  'C++',
  'Java',
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'SQL',
  'Pandas',
  'NumPy',
  'Machine Learning',
  'Git',
  'Cloud',
  'Linux',
  'Docker',
  'APIs',
  'Cybersecurity',
  'Networking',
];

const CAREER_GOALS = [
  'AI Engineer',
  'Software Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'Data Analyst',
  'Cloud Engineer',
  'Cybersecurity Engineer',
  'DevOps Engineer',
];

export const SetupProfileModal: React.FC<SetupProfileModalProps> = ({
  isOpen,
  currentProfile,
  onClose,
  onCompleteProfile,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State initialized with either user profile or clean editable defaults
  const [name, setName] = useState(
    currentProfile.isDemo ? '' : currentProfile.name
  );
  const [college, setCollege] = useState(
    currentProfile.isDemo ? '' : currentProfile.college
  );
  const [degree, setDegree] = useState(currentProfile.degree || 'B.Tech');
  const [branch, setBranch] = useState(currentProfile.branch || 'CSE');
  const [academicYear, setAcademicYear] = useState(
    currentProfile.academicYear || '2nd Year'
  );
  const [careerGoal, setCareerGoal] = useState(
    currentProfile.careerGoal || 'AI Engineer'
  );

  const [skills, setSkills] = useState<string[]>(
    currentProfile.isDemo ? ['Python', 'SQL'] : currentProfile.skills
  );
  const [customSkill, setCustomSkill] = useState('');

  // Notification Preferences explicitly targeting Hackathons, Internships, Certifications
  const [notifyHackathons, setNotifyHackathons] = useState(
    currentProfile.notificationPrefs?.notifyHackathons ?? true
  );
  const [notifyInternships, setNotifyInternships] = useState(
    currentProfile.notificationPrefs?.notifyInternships ?? true
  );
  const [notifyCertifications, setNotifyCertifications] = useState(
    currentProfile.notificationPrefs?.notifyCertifications ?? true
  );
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(
    currentProfile.notificationPrefs?.notifyDailyDigest ?? true
  );
  const [notifyUrgentDeadlines, setNotifyUrgentDeadlines] = useState(
    currentProfile.notificationPrefs?.notifyUrgentDeadlines ?? true
  );
  const [emailAlerts, setEmailAlerts] = useState(
    currentProfile.notificationPrefs?.emailAlerts || ''
  );

  const [errorMsg, setErrorMsg] = useState('');

  const toggleSkill = (s: string) => {
    if (skills.some((item) => item.toLowerCase() === s.toLowerCase())) {
      setSkills(skills.filter((item) => item.toLowerCase() !== s.toLowerCase()));
    } else {
      setSkills([...skills, s]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim()) {
      if (
        !skills.some(
          (item) => item.toLowerCase() === customSkill.trim().toLowerCase()
        )
      ) {
        setSkills([...skills, customSkill.trim()]);
      }
      setCustomSkill('');
    }
  };

  const handleNextFromStep1 = () => {
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!college.trim()) {
      setErrorMsg('Please enter your college or university.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (skills.length === 0) {
      setErrorMsg('Please select at least 1 technical skill.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!notifyHackathons && !notifyInternships && !notifyCertifications) {
      setErrorMsg(
        'Please enable notification for at least one opportunity type (Hackathons, Internships, or Certifications).'
      );
      return;
    }

    const updatedProfile: StudentProfile = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      college: college.trim(),
      degree,
      branch,
      academicYear,
      skills,
      interests: [
        careerGoal.includes('AI') ? 'AI/ML' : 'Web Development',
        'Cloud',
        'Programming',
      ],
      careerGoal,
      preferredMode: 'Online',
      budgetPreference: 'Free',
      isDemo: false,
      notificationPrefs: {
        notifyHackathons,
        notifyInternships,
        notifyCertifications,
        notifyDailyDigest,
        notifyUrgentDeadlines,
        emailAlerts: emailAlerts.trim() || undefined,
      },
    };

    onCompleteProfile(updatedProfile);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Personalize Profile & Opportunity Alerts</span>
            </h2>
            <p className="text-xs text-slate-500">
              Set your target role and tell us which opportunities to notify you
              about.
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

        {/* Step Indicator */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-center">
          <div
            className={`py-3 px-2 border-b-2 transition-colors ${
              step === 1
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : step > 1
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400'
            }`}
          >
            1. Academic Identity
          </div>
          <div
            className={`py-3 px-2 border-b-2 transition-colors ${
              step === 2
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : step > 2
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400'
            }`}
          >
            2. Skills & Tech Stack
          </div>
          <div
            className={`py-3 px-2 border-b-2 transition-colors ${
              step === 3
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-400'
            }`}
          >
            3. Alert Preferences
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Wizard Form Content */}
        <div className="p-6 space-y-5 flex-1">
          {/* STEP 1: Academic & Target Career */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyanshu Verma"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi, BITS Pilani, NIT"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree
                  </label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="B.Sc">B.Sc Computer Science</option>
                    <option value="BCA">BCA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch / Major
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="AI & DS">AI & Data Science</option>
                    <option value="ECE">ECE (Electronics)</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Other">Other Department</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="1st Year">1st Year (Fresher)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior / Final)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Career Goal
                  </label>
                  <select
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-indigo-50 border border-indigo-200 font-semibold text-indigo-900 rounded-lg"
                  >
                    {CAREER_GOALS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Skills */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Select the skills you currently know or are learning:
                </h3>
                <p className="text-[11px] text-slate-500">
                  Selected skills directly boost your Opportunity Match Score
                  across all hackathons and internships.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-1">
                {Array.from(new Set([...POPULAR_SKILLS, ...skills])).map((s) => {
                  const has = skills.some(
                    (item) => item.toLowerCase() === s.toLowerCase()
                  );
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSkill(s)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        has
                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {has ? `✓ ${s}` : `+ ${s}`}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add custom skill (e.g. Next.js, PyTorch, Flutter)..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </form>

              <div className="text-xs text-slate-500 pt-1">
                Selected ({skills.length}):{' '}
                <strong className="text-slate-800">
                  {skills.length > 0 ? skills.join(', ') : 'None'}
                </strong>
              </div>
            </div>
          )}

          {/* STEP 3: Opportunity Alert Preferences (Explicitly Hackathons, Internships, Certifications) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <span>
                    Tell Us Which Opportunities You Want to Be Notified About:
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select which opportunities to track in your live notification
                  feed and email updates:
                </p>
              </div>

              {/* 3 Major Opportunity Toggles */}
              <div className="space-y-2.5">
                {/* Hackathons Toggle Card */}
                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    notifyHackathons
                      ? 'border-indigo-400 bg-indigo-50/50'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={notifyHackathons}
                    onChange={(e) => setNotifyHackathons(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-indigo-600" />
                        Hackathons & Coding Challenges
                      </span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-semibold">
                        Devpost, Unstop, SIH, MLH
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Get alerted when hackathons matching {careerGoal} and{' '}
                      {skills.slice(0, 2).join(', ')} launch or close
                      registration.
                    </p>
                  </div>
                </label>

                {/* Internships Toggle Card */}
                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    notifyInternships
                      ? 'border-indigo-400 bg-indigo-50/50'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={notifyInternships}
                    onChange={(e) => setNotifyInternships(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        Internships & Open Source Fellowships
                      </span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-semibold">
                        Stipends, GSoC, Google Careers
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Get alerted about verified stipend-bearing summer/winter
                      internships across Internshala, Wellfound, and AICTE.
                    </p>
                  </div>
                </label>

                {/* Certifications Toggle Card */}
                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    notifyCertifications
                      ? 'border-indigo-400 bg-indigo-50/50'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={notifyCertifications}
                    onChange={(e) => setNotifyCertifications(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        Professional Certifications & Badges
                      </span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-semibold">
                        Google Cloud, NPTEL, AWS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Get notified when free skill badges, NPTEL IIT courseware,
                      and Microsoft credentials open for enrollment.
                    </p>
                  </div>
                </label>
              </div>

              {/* Deadline & Frequency Controls */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs font-semibold text-slate-800">
                  Notification Triggers:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyUrgentDeadlines}
                      onChange={(e) => setNotifyUrgentDeadlines(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Deadline Warnings (Closing in 1–2 days)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyDailyDigest}
                      onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Daily Fresh Drops (Every Morning)</span>
                  </label>
                </div>
              </div>

              {/* Optional Email Alerts */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Alerts (Optional for Daily Digest)</span>
                </label>
                <input
                  type="email"
                  value={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.value)}
                  placeholder="e.g. you@college.edu"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Buttons */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setStep((prev) => (prev - 1) as any);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={handleNextFromStep1}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg inline-flex items-center gap-1.5"
            >
              <span>Continue to Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleNextFromStep2}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg inline-flex items-center gap-1.5"
            >
              <span>Continue to Notification Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg inline-flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Activate Profile & Start Notifications</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
