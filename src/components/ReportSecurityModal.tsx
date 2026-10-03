import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  ShieldAlert,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  submitSecurityReport,
  sanitizeString,
  SecurityReport,
} from '../utils/security';

interface ReportSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const ReportSecurityModal: React.FC<ReportSecurityModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [issueType, setIssueType] = useState<SecurityReport['issueType']>('vulnerability');
  const [severity, setSeverity] = useState<SecurityReport['severity']>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanTitle = sanitizeString(title);
    const cleanDesc = sanitizeString(description);

    if (!cleanTitle || cleanTitle.length < 5) {
      setErrorMessage('Please provide a descriptive summary of the issue (at least 5 characters).');
      return;
    }

    if (!cleanDesc || cleanDesc.length < 15) {
      setErrorMessage('Please provide detailed steps or context (at least 15 characters).');
      return;
    }

    setIsSubmitting(true);

    const result = submitSecurityReport({
      issueType,
      severity,
      title: cleanTitle,
      description: cleanDesc,
      contactEmail: email ? sanitizeString(email) : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      onSuccessToast(result.message);
      // Reset fields
      setTitle('');
      setDescription('');
      setEmail('');
      onClose();
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <span>Report a Security or Safety Issue</span>
            </h2>
            <p className="text-xs text-slate-500">
              Responsible disclosure channel. Reports are encrypted and strictly confidential.
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

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Privacy Notice Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-slate-800">Confidentiality Guarantee:</strong>
              <p className="text-[11px] leading-relaxed">
                Security submissions are stored securely and never published publicly. We prioritize responsible disclosure and protect researcher privacy.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {errorMessage}
            </div>
          )}

          {/* Issue Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Category of Issue</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            >
              <option value="vulnerability">Security Vulnerability (XSS, Injection, CSP)</option>
              <option value="suspicious_activity">Suspicious Activity or Malicious Pattern</option>
              <option value="insecure_link">Insecure Link or Broken Official Redirect</option>
              <option value="abusive_content">Abusive Content or Spam</option>
              <option value="other">Unauthorized Access or Privacy Concern</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Estimated Severity</label>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {[
                { id: 'low', label: 'Low', color: 'border-slate-200 text-slate-700' },
                { id: 'medium', label: 'Medium', color: 'border-amber-300 text-amber-700 bg-amber-50/50' },
                { id: 'high', label: 'High', color: 'border-orange-300 text-orange-700 bg-orange-50/50' },
                { id: 'critical', label: 'Critical', color: 'border-rose-400 text-rose-700 bg-rose-50' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeverity(s.id as any)}
                  className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    severity === s.id
                      ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50 text-indigo-700'
                      : s.color
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Issue Summary</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unsanitized parameter in search query filter"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Detailed Description & Steps to Reproduce</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact steps, affected component, and expected vs observed behavior..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          {/* Optional Contact */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">
              Contact Email <span className="font-normal text-slate-500">(Optional for follow-up)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@example.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording...' : 'Submit Report Confidentially'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
