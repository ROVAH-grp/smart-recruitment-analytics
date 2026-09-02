import { apiFetch } from "./client";

export interface Application {
  applicationId: string;

  candidateId: string;
  jobId: string;

  recruiterId: number | null;
  sourceId: number | null;

  applicationDate: string | null;
  screeningDate: string | null;
  shortlistDate: string | null;
  interviewDate: string | null;
  selectionDate: string | null;
  offerDate: string | null;
  joiningDate: string | null;

  status: string | null;

  matchScore: string | number | null;
  recruitmentCost: string | number | null;

  createdAt: string;

  candidate?: {
    candidateId: string;
    candidateName: string;
    experienceYears: string | number | null;
    education: string | null;
    createdAt: string;
  } | null;

  job?: {
    jobId: string;
    jobTitle: string;
    department: string | null;
    jobPostedDate: string | null;
    createdAt: string;
  } | null;

  recruiter?: {
    recruiterId: number;
    recruiterName: string;
    createdAt: string;
  } | null;

  source?: {
    sourceId: number;
    sourceName: string;
    createdAt: string;
  } | null;
}

export interface ApplicationsResponse {
  data: Application[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateApplicationData {
  candidateId: string;
  jobId: string;

  recruiterId?: number;
  sourceId?: number;

  applicationDate?: string;
  screeningDate?: string;
  shortlistDate?: string;
  interviewDate?: string;
  selectionDate?: string;
  offerDate?: string;
  joiningDate?: string;

  status?: string;

  matchScore?: number;
  recruitmentCost?: number;
}

export async function getApplications(
  page = 1,
  limit = 7,
  search = "",
): Promise<ApplicationsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  return apiFetch<ApplicationsResponse>(
    `/applications?${params.toString()}`,
  );
}

export async function getApplication(
  id: string,
): Promise<Application> {
  return apiFetch<Application>(
    `/applications/${id}`,
  );
}

export async function createApplication(
  data: CreateApplicationData,
): Promise<Application> {
  return apiFetch<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateApplication(
  id: string,
  data: Partial<CreateApplicationData>,
): Promise<Application> {
  return apiFetch<Application>(
    `/applications/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteApplication(
  id: string,
): Promise<void> {
  await apiFetch(`/applications/${id}`, {
    method: "DELETE",
  });
}