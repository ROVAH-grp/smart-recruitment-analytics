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

export interface CandidateResume {
  fileName: string;
  fileUrl: string;
  publicId?: string;
  uploadedAt?: string;
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

/* ─────────────────────────────────────────────
   Resume APIs
───────────────────────────────────────────── */

export async function getCandidateResume(
  candidateId: string,
): Promise<CandidateResume | null> {
  try {
    return await apiFetch<CandidateResume>(
      `/candidates/${candidateId}/resume`,
    );
  } catch (error: any) {
    // No resume uploaded yet
    if (error?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function uploadCandidateResume(
  candidateId: string,
  file: File,
): Promise<CandidateResume> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<CandidateResume>(
    `/candidates/${candidateId}/resume`,
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function deleteCandidateResume(
  candidateId: string,
): Promise<void> {
  await apiFetch(`/candidates/${candidateId}/resume`, {
    method: "DELETE",
  });
}