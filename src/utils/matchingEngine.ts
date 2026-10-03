import {
  Opportunity,
  StudentProfile,
  MatchBreakdown,
  DeadlineInfo,
} from '../types/opportunity';
import { getFriendlyDateWithOffset } from '../data/initialData';

export function calculateMatchScore(
  profile: StudentProfile,
  opportunity: Opportunity
): MatchBreakdown {
  const userSkills = new Set(profile.skills.map((s) => s.toLowerCase().trim()));
  const skillsHave: string[] = [];
  const skillsNeed: string[] = [];

  for (const s of opportunity.skills) {
    if (userSkills.has(s.toLowerCase().trim())) {
      skillsHave.push(s);
    } else {
      skillsNeed.push(s);
    }
  }

  // 1. Skills Score
  let skillsScore = 60;
  if (opportunity.skills.length > 0) {
    const ratio = skillsHave.length / opportunity.skills.length;
    skillsScore = Math.round(45 + ratio * 55);
  }

  // 2. Branch Score
  const branchNorm = profile.branch.toLowerCase();
  let branchScore = 85;
  if (
    ['cse', 'it', 'cs', 'ai', 'data', 'computer'].some((k) =>
      branchNorm.includes(k)
    )
  ) {
    branchScore = 100;
  }

  // 3. Year Score
  const yearMatched =
    opportunity.academicYears.includes('All Years') ||
    opportunity.academicYears.includes(profile.academicYear);
  const yearScore = yearMatched ? 100 : 60;

  // 4. Interest & Goal Fit
  let interestScore = 70;
  const domainNorm = opportunity.domain.toLowerCase();
  const goalNorm = profile.careerGoal.toLowerCase();
  const hasInterest = profile.interests.some(
    (i) =>
      i.toLowerCase().includes(domainNorm) || domainNorm.includes(i.toLowerCase())
  );
  const goalMatches =
    (goalNorm.includes('ai') && domainNorm.includes('ai')) ||
    (goalNorm.includes('web') && domainNorm.includes('web')) ||
    (goalNorm.includes('data') && domainNorm.includes('data')) ||
    (goalNorm.includes('software') && domainNorm.includes('programming'));

  if (hasInterest && goalMatches) {
    interestScore = 98;
  } else if (hasInterest || goalMatches) {
    interestScore = 90;
  }

  // 5. Mode Score
  let modeScore = 85;
  if (
    profile.preferredMode === 'Any' ||
    profile.preferredMode === opportunity.mode
  ) {
    modeScore = 100;
  } else if (opportunity.mode === 'Online') {
    modeScore = 95;
  }

  const overall = Math.min(
    99,
    Math.max(
      40,
      Math.round(
        skillsScore * 0.35 +
          interestScore * 0.25 +
          yearScore * 0.15 +
          branchScore * 0.15 +
          modeScore * 0.1
      )
    )
  );

  const reasons: string[] = [];
  if (skillsHave.length > 0) {
    reasons.push(`You have skills in ${skillsHave.join(', ')}`);
  }
  if (yearMatched) {
    reasons.push(`Matches your ${profile.academicYear} eligibility`);
  }
  if (hasInterest || goalMatches) {
    reasons.push(`Aligned with your ${profile.careerGoal} target`);
  }
  if (opportunity.cost === 'Free' && profile.budgetPreference === 'Free') {
    reasons.push('100% Free / Sponsored opportunity');
  }
  if (opportunity.mode === 'Online') {
    reasons.push('Remote / Online participation available');
  }

  return {
    overall,
    skillsScore,
    branchScore,
    yearScore,
    interestScore,
    modeScore,
    reasons,
    skillsHave,
    skillsNeed,
  };
}

export function getDynamicDeadlineInfo(offsetDays: number): DeadlineInfo {
  if (offsetDays >= 900) {
    return {
      dateString: 'Rolling / Open 24/7',
      daysRemaining: 999,
      urgency: 'Rolling',
      label: 'Rolling Enrollment (Active Everyday)',
    };
  }

  const dateString = getFriendlyDateWithOffset(offsetDays);

  if (offsetDays === 0) {
    return {
      dateString,
      daysRemaining: 0,
      urgency: 'Urgent',
      label: 'Deadline Today',
    };
  }

  if (offsetDays === 1) {
    return {
      dateString,
      daysRemaining: 1,
      urgency: 'Closing Soon',
      label: 'Tomorrow (1 day left)',
    };
  }

  if (offsetDays === 2) {
    return {
      dateString,
      daysRemaining: 2,
      urgency: 'Closing Soon',
      label: '2 days left',
    };
  }

  if (offsetDays <= 7) {
    return {
      dateString,
      daysRemaining: offsetDays,
      urgency: 'Upcoming',
      label: `${offsetDays} days left`,
    };
  }

  return {
    dateString,
    daysRemaining: offsetDays,
    urgency: 'Active',
    label: `${offsetDays} days left`,
  };
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
