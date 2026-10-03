import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Eye,
  RefreshCw,
  Clock,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Terminal,
  Server,
  Zap,
} from 'lucide-react';
import {
  runSecurityAuditCheck,
  SecurityAuditResult,
  getSecurityLogs,
  SecurityLogItem,
  clearSecurityLogs,
  getSecurityReports,
  SecurityReport,
  checkRateLimit,
  recordRateLimitHit,
} from '../utils/security';

interface SecurityDashboardProps {
  onOpenReportModal: () => void;
  onOpenAdminPortal: () => void;
  onOpenLegalModal: (tab: 'privacy' | 'terms' | 'cookies' | 'copyright') => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  onOpenReportModal,
  onOpenAdminPortal,
  onOpenLegalModal,
}) => {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult>(() =>
    runSecurityAuditCheck()
  );
  const [logs, setLogs] = useState<SecurityLogItem[]>(() => getSecurityLogs());
  const [reports, setReports] = useState<SecurityReport[]>(() =>
    getSecurityReports()
  );
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'audit' | 'reports'>(
    'overview'
  );
  const [rateTestStatus, setRateTestStatus] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getSecurityLogs());
    setReports(getSecurityReports());
  }, []);

  const handleRunAudit = () => {
    const updated = runSecurityAuditCheck();
    setAuditResult(updated);
    setLogs(getSecurityLogs());
  };

  const handleTestRateLimit = () => {
    const check = checkRateLimit('test_rate_action', 5, 20000, 30000);
    recordRateLimitHit('test_rate_action');
    if (check.allowed) {
      setRateTestStatus(
        `✓ Request permitted. Remaining quota: ${check.remaining - 1}/5 in 20s window.`
      );
    } else {
      setRateTestStatus(
        `⚠️ Throttled! Rate limiter triggered. Cooldown: ${Math.ceil(
          check.resetInMs / 1000
        )}s.`
      );
    }
    setLogs(getSecurityLogs());
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold font-display text-slate-900">
              Security & Protection Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Defense Grade: Protected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Continuous defensive hardening, strict content security policy, input
            sanitization, and automated abuse protection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRunAudit}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-scan Security</span>
          </button>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Report a Security Issue</span>
          </button>
        </div>
      </div>

      {/* Honest Security Disclaimer per Prompt Specifications */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Security Reality Disclaimer</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          In compliance with honest security principles: no software system, web
          portal, or device is 100% invulnerable or impossible to hack. Career
          Launchpad implements industry-standard defense-in-depth, client-side
          sanitization, CSP headers, rate-limiting, and minimal data storage to
          proactively minimize attack surface.
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
          <div className="text-[11px] font-medium text-slate-500">Authentication & Access</div>
          <div className="text-lg font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Protected</span>
          </div>
          <p className="text-[10px] text-slate-500">Rate-limited, lockout guards, no backdoors</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
          <div className="text-[11px] font-medium text-slate-500">XSS & Injection Defense</div>
          <div className="text-lg font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Protected</span>
          </div>
          <p className="text-[10px] text-slate-500">Strict HTML stripping, safe URL protocol checks</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
          <div className="text-[11px] font-medium text-slate-500">API & Secret Protection</div>
          <div className="text-lg font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Protected</span>
          </div>
          <p className="text-[10px] text-slate-500">Zero database credentials or private keys in client</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
          <div className="text-[11px] font-medium text-slate-500">Content Security Policy</div>
          <div className="text-lg font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Protected</span>
          </div>
          <p className="text-[10px] text-slate-500">Restricted scripts, object-src none, nosniff headers</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Security Health Checks' },
            { id: 'audit', label: `Live Audit Logs (${logs.length})` },
            { id: 'reports', label: `Confidential Reports (${reports.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2.5 border-b-2 transition-colors ${
                activeSubTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
          Last Check: {auditResult.lastChecked}
        </div>
      </div>

      {/* Tab: Overview / Health Checks */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditResult.checks.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">
                    {c.category}
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.description}
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Mitigation:</strong> {c.mitigation}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Rate-Limiting Defense Sandbox */}
          <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Abuse Defense & Rate Limiter Test Console</span>
                </h3>
                <p className="text-[11px] text-slate-600">
                  Simulate high-frequency requests to verify that automated abuse
                  is throttled before resource exhaustion occurs.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestRateLimit}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                Send Fast Request
              </button>
            </div>

            {rateTestStatus && (
              <div className="text-xs font-mono p-2.5 rounded-lg bg-white border border-indigo-200 text-slate-800">
                {rateTestStatus}
              </div>
            )}
          </div>

          {/* Security Recommendations */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <h3 className="text-xs font-bold text-slate-900">
              Proactive Defensive Security Recommendations
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Client-Side Sanitization:</strong> All student-submitted
                  strings (custom skills, notes, search queries) are sanitized
                  to eradicate tag and script execution vectors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Safe-Link Validation:</strong> External redirect
                  URLs are strictly verified to ensure valid http/https schemes,
                  preventing javascript/data uri exploits.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Local-First Zero Telemetry:</strong> Profile and saved
                  applications are preserved in browser sandbox storage rather than
                  transmitting identifying credentials to third-party ad brokers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Live Audit Logs */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Chronological security audit events recorded on this device:
            </span>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearSecurityLogs();
                  setLogs([]);
                }}
                className="text-slate-400 hover:text-rose-600 font-medium"
              >
                Clear Local Logs
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              No security events recorded yet. Perform actions or run a security
              scan to generate logs.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    log.severity === 'high'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : log.severity === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-[11px]">{log.eventType}</span>
                    <p className="text-[11px]">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Confidential Reports */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Encrypted security incident and vulnerability reports filed by
              users:
            </span>
            <button
              type="button"
              onClick={onOpenReportModal}
              className="text-indigo-600 hover:underline font-semibold"
            >
              + File New Report
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              No vulnerability or incident reports filed.
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rep.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        rep.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : rep.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rep.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {rep.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
                    <span>Type: {rep.issueType}</span>
                    <span>Status: {rep.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Legal & Protected Links */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpenLegalModal('privacy')}
            className="hover:text-slate-900 underline underline-offset-2"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onOpenLegalModal('terms')}
            className="hover:text-slate-900 underline underline-offset-2"
          >
            Terms of Use
          </button>
          <button
            type="button"
            onClick={() => onOpenLegalModal('cookies')}
            className="hover:text-slate-900 underline underline-offset-2"
          >
            Cookie Policy
          </button>
          <button
            type="button"
            onClick={() => onOpenLegalModal('copyright')}
            className="hover:text-slate-900 underline underline-offset-2"
          >
            Ownership & Licenses
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenAdminPortal}
          className="text-xs font-semibold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Admin Security Access</span>
        </button>
      </div>
    </div>
  );
};
