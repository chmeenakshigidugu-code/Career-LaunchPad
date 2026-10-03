export type OpportunityCategory =
  | 'Hackathon'
  | 'Internship'
  | 'Certification'
  | 'Competition'
  | 'Fellowship'
  | 'Workshop';

export type OpportunityMode = 'Online' | 'Offline' | 'Hybrid';

export type OpportunityDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type CostType = 'Free' | 'Paid';

export type StipendCategory =
  | 'Stipend Provided'
  | 'Unpaid'
  | 'Student-Paid / Fee Required'
  | 'Prize Pool / Grant'
  | 'Free Certificate / Credits'
  | 'N/A';

export type DeadlineUrgency =
  | 'Urgent'       // Deadline today (0 days)
  | 'Closing Soon' // 1-2 days
  | 'Upcoming'     // 3-7 days
  | 'Active'       // > 7 days
  | 'Rolling';     // Ongoing / Open year-round

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  domain: string;
  skills: string[];
  eligibility: string;
  academicYears: string[];
  mode: OpportunityMode;
  location: string;
  cost: CostType;
  registrationFeeText?: string;
  stipendCategory: StipendCategory;
  stipend: string;
  duration: string;
  deadlineDaysOffset: number; // Days from today so it's fresh everyday!
  eventDateText: string;
  difficulty: OpportunityDifficulty;
  officialUrl: string;
  verified: boolean;
  featuredToday?: boolean;
  addedToday?: boolean;
  teamSize?: string;
  certificateAvailable?: boolean;
  tags?: string[];
}

export interface NotificationPreferences {
  notifyHackathons: boolean;
  notifyInternships: boolean;
  notifyCertifications: boolean;
  notifyDailyDigest: boolean;
  notifyUrgentDeadlines: boolean;
  emailAlerts?: string;
}

export interface InAppNotification {
  id: string;
  category: 'Hackathon' | 'Internship' | 'Certification' | 'Deadline';
  title: string;
  message: string;
  opportunityId?: string;
  timeAgo: string;
  read: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  college: string;
  degree: string;
  branch: string;
  academicYear: string;
  skills: string[];
  interests: string[];
  careerGoal: string;
  preferredMode: OpportunityMode | 'Any';
  budgetPreference: 'Free' | 'Any';
  isDemo?: boolean;
  notificationPrefs: NotificationPreferences;
}

export interface MatchBreakdown {
  overall: number;
  skillsScore: number;
  branchScore: number;
  yearScore: number;
  interestScore: number;
  modeScore: number;
  reasons: string[];
  skillsHave: string[];
  skillsNeed: string[];
}

export interface DeadlineInfo {
  dateString: string;
  daysRemaining: number;
  urgency: DeadlineUrgency;
  label: string;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Interested'
  | 'Applied'
  | 'Interviewing'
  | 'Accepted'
  | 'Rejected';

export interface ApplicationRecord {
  opportunityId: string;
  status: ApplicationStatus;
  notes: string;
  updatedAt: string;
}
