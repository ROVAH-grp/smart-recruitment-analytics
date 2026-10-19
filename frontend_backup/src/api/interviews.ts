import { apiFetch } from "./client";

export interface Interview {
  interviewId: string;
  applicationId: string;
  interviewDate: string | null;
  technicalScore: string | number | null;
  communicationScore: string | number | null;
  problemSolvingScore: string | number | null;
  overallScore: string | number | null;
  createdAt: string;
}

export interface InterviewsResponse {
  data: Interview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateInterviewData {
  applicationId: string;
  interviewDate?: string;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
}

export async function getInterviews(
  page = 1,
  limit = 20,
): Promise<InterviewsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<InterviewsResponse>(
    `/interviews?${params.toString()}`,
  );
}

export async function getInterview(
  id: string,
): Promise<Interview> {
  return apiFetch<Interview>(`/interviews/${id}`);
}

export async function createInterview(
  data: CreateInterviewData,
): Promise<Interview> {
  return apiFetch<Interview>("/interviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateInterview(
  id: string,
  data: Partial<CreateInterviewData>,
): Promise<Interview> {
  return apiFetch<Interview>(`/interviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteInterview(
  id: string,
): Promise<void> {
  await apiFetch(`/interviews/${id}`, {
    method: "DELETE",
  });
}