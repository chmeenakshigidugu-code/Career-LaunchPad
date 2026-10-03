import React, { useState } from 'react';
import {
  X,
  Bell,
  Code,
  Briefcase,
  Award,
  Clock,
  CheckCircle2,
  ExternalLink,
  Settings,
  Sparkles,
} from 'lucide-react';
import { InAppNotification, StudentProfile } from '../types/opportunity';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  notifications: InAppNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (oppId?: string) => void;
  onOpenSettings: () => void;
  onTriggerTestAlert: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  profile,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onOpenSettings,
  onTriggerTestAlert,
}) => {
  if (!isOpen) return null;

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | 'Hackathon' | 'Internship' | 'Certification' | 'Deadline'
  >('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategoryFilter === 'all') return true;
    return n.category === activeCategoryFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (cat: InAppNotification['category']) => {
    switch (cat) {
      case 'Hackathon':
        return <Code className="w-4 h-4 text-indigo-600" />;
      case 'Internship':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'Certification':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'Deadline':
        return <Clock className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Opportunity Alerts & Updates</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live updates matched to your configured alert preferences.
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

        {/* Active Subscriptions Summary */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-700">Subscribed to:</span>
            {profile.notificationPrefs.notifyHackathons && (
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-bold">
                Hackathons
              </span>
            )}
            {profile.notificationPrefs.notifyInternships && (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Internships
              </span>
            )}
            {profile.notificationPrefs.notifyCertifications && (
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                Certifications
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="text-[11px] font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-2 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'Hackathon', label: 'Hackathons' },
              { id: 'Internship', label: 'Internships' },
              { id: 'Certification', label: 'Certifications' },
              { id: 'Deadline', label: 'Deadlines' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveCategoryFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap text-[11px] ${
                  activeCategoryFilter === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] text-indigo-600 hover:underline whitespace-nowrap font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="p-6 space-y-3 flex-1 overflow-y-auto max-h-80">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No notifications in this category right now.</p>
              <button
                type="button"
                onClick={onTriggerTestAlert}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                + Send a Test Alert
              </button>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-colors flex items-start justify-between gap-3 text-xs ${
                  notif.read
                    ? 'bg-white border-slate-200'
                    : 'bg-indigo-50/40 border-indigo-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {notif.timeAgo}
                    </span>
                  </div>
                </div>

                {notif.opportunityId && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectNotification(notif.opportunityId);
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg shrink-0"
                  >
                    View
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onTriggerTestAlert}
            className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Live Drop</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
