import { apiFetch } from "./client";

export interface Recruiter {
  recruiterId: number;
  recruiterName: string;
  createdAt: string;
}

export interface RecruitersResponse {
  data: Recruiter[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateRecruiterData {
  recruiterName: string;
}

export async function getRecruiters(
  page = 1,
  limit = 100,
): Promise<RecruitersResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<RecruitersResponse>(
    `/recruiters?${params.toString()}`,
  );
}

export async function getRecruiter(id: number): Promise<Recruiter> {
  return apiFetch<Recruiter>(`/recruiters/${id}`);
}

export async function createRecruiter(
  data: CreateRecruiterData,
): Promise<Recruiter> {
  return apiFetch<Recruiter>("/recruiters", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateRecruiter(
  id: number,
  data: Partial<CreateRecruiterData>,
): Promise<Recruiter> {
  return apiFetch<Recruiter>(`/recruiters/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteRecruiter(id: number): Promise<void> {
  await apiFetch(`/recruiters/${id}`, {
    method: "DELETE",
  });
}