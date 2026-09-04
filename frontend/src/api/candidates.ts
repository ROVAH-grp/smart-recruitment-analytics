import { apiFetch } from "./client";

export interface Candidate {
  candidateId: string;
  candidateName: string;
  experienceYears: string | number | null;
  education: string | null;
  createdAt: string;
}

export interface CandidatesResponse {
  data: Candidate[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCandidateData {
  candidateId: string;
  candidateName: string;
  experienceYears?: number;
  education?: string;
}

export async function getCandidates(
  page = 1,
  limit = 20,
  search = "",
): Promise<CandidatesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  return apiFetch<CandidatesResponse>(
    `/candidates?${params.toString()}`,
  );
}

export async function getCandidate(id: string): Promise<Candidate> {
  const response = await apiFetch<{ data: Candidate }>(
    `/candidates/${id}`,
  );

  return response.data;
}

export async function createCandidate(
  data: CreateCandidateData,
): Promise<Candidate> {
  return apiFetch<Candidate>("/candidates", {
    method: "POST",
    body: JSON.stringify(data),
  });

}

export async function updateCandidate(
  id: string,
  data: {
    candidateName?: string;
    experienceYears?: number;
    education?: string;
  },
): Promise<Candidate> {
  return apiFetch<Candidate>(`/candidates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCandidate(id: string): Promise<void> {
  await apiFetch(`/candidates/${id}`, {
    method: "DELETE",
  });
}