import { apiDownload, apiFetch } from "./client";
import type { Application } from "./applications";
import { getJobs } from "./jobs";
import { getRecruiters } from "./recruiters";

/* ------------------------------------------------------------------ *
 * Typed calls for the automated hiring pipeline (Phases A to G).
 * The backend wraps every answer as { data } (lists also carry { meta }).
 * ------------------------------------------------------------------ */

export interface Paged<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

async function get<T>(endpoint: string): Promise<T> {
  const response = await apiFetch<{ data: T }>(endpoint);
  return response.data;
}

async function post<T>(endpoint: string, body?: unknown): Promise<T> {
  const response = await apiFetch<{ data: T }>(endpoint, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return response.data;
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.append(key, String(value));
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

/* ---------------------------- types ------------------------------- */

export interface StageEvent {
  from: string | null;
  to: string;
  reason: string | null;
  by: string;
  at: string;
}

export interface StageHistory {
  applicationId: string;
  currentStatus: string | null;
  jobTitle: string | null;
  timeline: StageEvent[];
}

export interface AiReport {
  applicationId: string;
  candidate: string | null;
  jobTitle: string | null;
  overallScore: number;
  breakdown: Record<string, number> | null;
  matchedSkills: string[];
  missingSkills: string[];
  skillCoverage: number | null;
  recommendation: string;
  currentStatus: string | null;
}

export interface Invitation {
  invitationId: string;
  token: string;
  candidateId: string;
  jobId: string;
  recruiterId: number | null;
  message: string | null;
  status: string;
  applicationId: string | null;
  expiresAt: string;
  respondedAt: string | null;
  createdAt: string;
}

export interface InterviewRound {
  roundId: string;
  applicationId?: string;
  roundNumber: number;
  roundName: string;
  status: string;
  mode: string;
  meetingLink: string | null;
  proposedSlots: string[] | null;
  scheduledAt: string | null;
  // Only recruiters and admins receive the fields below.
  interviewerRecruiterId?: number | null;
  technicalScore?: string | null;
  communicationScore?: string | null;
  problemSolvingScore?: string | null;
  overallScore?: string | null;
  result?: string | null;
  feedback?: string | null;
}

export interface InterviewList {
  applicationId: string;
  applicationStatus: string | null;
  roundPlan: string[];
  passMark?: number;
  rounds: InterviewRound[];
}

export interface ScorecardResult {
  round: InterviewRound;
  outcome: "NEXT_ROUND" | "SELECTED" | "REJECTED";
  overallScore: number;
  passMark: number;
  applicationStatus: string | null;
  nextRound: string | null;
}

export interface OfferLetter {
  offerLetterId: string;
  applicationId: string;
  token: string;
  designation: string;
  department: string | null;
  salaryAmount: string;
  salaryPeriod: string;
  currency: string;
  joiningDate: string;
  expiresAt: string;
  status: string;
  respondedAt: string | null;
  createdAt: string;
}

export interface OfferList {
  applicationId: string;
  applicationStatus: string | null;
  offers: OfferLetter[];
}

export interface ConfirmHireResult {
  offerLetter: OfferLetter;
  applicationStatus: string;
  emailSent: boolean;
  pdfAttached: boolean;
}

export interface OfferResponseResult {
  offerLetter: OfferLetter;
  applicationStatus: string | null;
  employee?: { employeeCode: string; workEmail: string; status: string } | null;
  welcomeEmailSent?: boolean;
  onboardingError?: string | null;
}

export interface OnboardingTask {
  taskId: string;
  title: string;
  status: string;
  completedAt: string | null;
}

export interface EmployeeProfile {
  employeeCode: string;
  fullName: string;
  workEmail: string;
  designation: string;
  department: string | null;
  joiningDate: string;
  daysUntilJoining: number;
  status: string;
  mustChangePassword: boolean;
  compensation: { amount: string; period: string; currency: string };
  onboarding: { done: number; total: number; tasks: OnboardingTask[] };
}

export interface EmployeeRow {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  workEmail: string;
  designation: string;
  department: string | null;
  joiningDate: string;
  status: string;
  applicationId: string;
  onboarding: { done: number; total: number };
}

export interface StuckApplication {
  applicationId: string;
  candidate: string | null;
  job: string | null;
  status: string;
  since: string;
  daysInStage: number;
}

export interface AutomationSummary {
  trigger: "schedule" | "manual";
  ranAt: string;
  durationMs: number;
  offersExpired: number;
  offerReminders: number;
  interviewReminders: number;
  slotReminders: number;
  invitationsExpired: number;
  employeesJoined: string[];
  errors: string[];
}

export interface AutomationStatus {
  enabled: boolean;
  schedule: string;
  running: boolean;
  settings: {
    offerReminderAfterDays: number;
    slotReminderAfterDays: number;
    interviewReminderHoursBefore: number;
  };
  lastRun: AutomationSummary | null;
}

export interface Overview {
  generatedAt: string;
  totals: { applications: number; open: number; joined: number; rejected: number; withdrawn: number };
  stages: Array<{ stage: string; count: number }>;
  funnel: Array<{ stage: string; reached: number; fromPreviousStage: number | null; fromApplied: number | null }>;
  averageDaysFromApplication: Record<string, number | null>;
  attention: {
    stuckAfterDays: number;
    scope: string;
    stuckCount: number;
    stuck: StuckApplication[];
    offersAwaitingAnswer: number;
    offersExpiringWithin2Days: number;
    interviewsNext7Days: number;
    interviewSlotsAwaitingCandidate: number;
    invitationsAwaitingAnswer: number;
    employeesOnboarding: number;
  };
  recent: {
    windowDays: number;
    newApplications: number;
    joined: number;
    offersAccepted: number;
    offersDeclined: number;
    emails: { sent: number; failed: number; skipped: number };
  };
  automation: AutomationStatus;
}

export interface ActivityRow {
  id: string;
  at: string;
  applicationId: string;
  candidate: string | null;
  job: string | null;
  from: string | null;
  to: string;
  reason: string | null;
  by: string;
}

export interface EmailLogRow {
  emailId: string;
  toEmail: string | null;
  subject: string;
  template: string;
  status: string;
  error: string | null;
  applicationId: string | null;
  createdAt: string;
}

/** The server allows at most 100 rows per request, so longer lists are read page by page. */
async function allPages<T>(
  load: (page: number) => Promise<{ data: T[]; meta: { totalPages: number } }>,
  maxPages = 10,
): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const result = await load(page);
    rows.push(...result.data);
    if (page >= result.meta.totalPages) break;
  }
  return rows;
}

export const getAllJobs = () => allPages((page) => getJobs(page, 100));

export const getAllRecruiters = () => allPages((page) => getRecruiters(page, 100));

/* --------------------- candidate side ------------------------------ */

export const applyForJob = (jobId: string) =>
  post<Application>("/pipeline/apply", { jobId });

export const getMyInvitations = () =>
  apiFetch<Paged<Invitation>>("/pipeline/invitations?limit=50");

export const respondToInvitation = (token: string, accept: boolean) =>
  post<{ invitation: Invitation; application: Application | null }>(
    `/pipeline/invitations/${token}/${accept ? "accept" : "decline"}`,
  );

export const withdrawApplication = (applicationId: string) =>
  post<Application>(`/pipeline/applications/${applicationId}/withdraw`);

export const getStageHistory = (applicationId: string) =>
  get<StageHistory>(`/pipeline/applications/${applicationId}/history`);

export const getInterviewRounds = (applicationId: string) =>
  get<InterviewList>(`/pipeline/applications/${applicationId}/interviews`);

export const confirmInterviewSlot = (roundId: string, slot: string) =>
  post<InterviewRound>(`/pipeline/interviews/${roundId}/confirm`, { slot });

export const getOffers = (applicationId: string) =>
  get<OfferList>(`/pipeline/applications/${applicationId}/offers`);

export const respondToOffer = (token: string, accept: boolean) =>
  post<OfferResponseResult>(
    `/pipeline/offers/${token}/${accept ? "accept" : "decline"}`,
  );

export const downloadOfferLetter = (offerLetterId: string) =>
  apiDownload(`/pipeline/offers/${offerLetterId}/pdf`, "Offer-Letter.pdf");

/* --------------------- recruiter / admin side ---------------------- */

export const getAiReport = (applicationId: string) =>
  get<AiReport>(`/pipeline/applications/${applicationId}/report`);

export const moveApplication = (
  applicationId: string,
  toStatus: "Screened" | "Shortlisted" | "Rejected",
  reason?: string,
) =>
  post<Application>(`/pipeline/applications/${applicationId}/transition`, {
    toStatus,
    reason: reason || undefined,
  });

export const createInvitation = (data: {
  candidateId: string;
  jobId: string;
  message?: string;
}) => post<Invitation>("/pipeline/invitations", data);

export const getInvitations = (page = 1, status = "") =>
  apiFetch<Paged<Invitation>>(
    `/pipeline/invitations${query({ page, limit: 20, status })}`,
  );

export const openInterviewRound = (
  applicationId: string,
  data: { slots: string[]; mode: string; meetingLink?: string },
) => post<InterviewRound>(`/pipeline/applications/${applicationId}/interviews`, data);

export const submitScorecard = (
  roundId: string,
  data: {
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    feedback?: string;
  },
) => post<ScorecardResult>(`/pipeline/interviews/${roundId}/scorecard`, data);

export const cancelInterviewRound = (roundId: string, reason?: string) =>
  post<InterviewRound>(`/pipeline/interviews/${roundId}/cancel`, { reason: reason || undefined });

export const confirmHire = (
  applicationId: string,
  data: { salaryAmount: number; salaryPeriod: string; joiningDate: string },
) => post<ConfirmHireResult>(`/pipeline/applications/${applicationId}/confirm-hire`, data);

export const retryOnboarding = (applicationId: string) =>
  post<{ employee: { employeeCode: string; workEmail: string }; created: boolean; emailSent: boolean }>(
    `/pipeline/applications/${applicationId}/onboard`,
  );

export const getEmployees = (page = 1, search = "") =>
  apiFetch<Paged<EmployeeRow>>(`/pipeline/employees${query({ page, limit: 20, search })}`);

export const markEmployeeJoined = (employeeId: string) =>
  post<EmployeeRow>(`/pipeline/employees/${employeeId}/mark-joined`);

export const resetEmployeeCredentials = (employeeId: string) =>
  post<{ employeeCode: string; emailSent: boolean }>(
    `/pipeline/employees/${employeeId}/reset-credentials`,
  );

export const getOverview = (days = 30, stuckDays = 7, scope = "pipeline") =>
  get<Overview>(`/pipeline/overview${query({ days, stuckDays, scope })}`);

export const getActivity = (page = 1, filters: { actor?: string; toStatus?: string; applicationId?: string } = {}) =>
  apiFetch<Paged<ActivityRow>>(`/pipeline/activity${query({ page, limit: 15, ...filters })}`);

export const getEmailLog = (page = 1, filters: { status?: string; template?: string } = {}) =>
  apiFetch<Paged<EmailLogRow>>(`/pipeline/activity/emails${query({ page, limit: 15, ...filters })}`);

export const getAutomationStatus = () => get<AutomationStatus>("/pipeline/automation/status");

export const runAutomationNow = () => post<AutomationSummary>("/pipeline/automation/run");

/* --------------------- employee side ------------------------------- */

export const getMyEmployeeProfile = () => get<EmployeeProfile>("/employees/me");

export const completeOnboardingTask = (taskId: string) =>
  post<OnboardingTask>(`/employees/me/onboarding/${taskId}/complete`);

export const changeMyPassword = (currentPassword: string, newPassword: string) =>
  post<{ message: string }>("/employees/me/change-password", { currentPassword, newPassword });

export const downloadMyOfferLetter = () =>
  apiDownload("/employees/me/offer-letter", "My-Offer-Letter.pdf");

/* --------------------- admin side ---------------------------------- */

export const createRecruiterAccount = (email: string, recruiterId: number) =>
  post<{ message: string; user: { email: string; recruiterId: number | null }; activationEmailSent: boolean }>(
    "/auth/recruiters",
    { email, recruiterId },
  );
