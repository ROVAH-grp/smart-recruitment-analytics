import { apiFetch } from "./client";

export interface Job {
  jobId: string;
  jobTitle: string;
  department: string | null;
  jobPostedDate: string | null;
  createdAt: string;
}

export interface JobsResponse {
  data: Job[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateJobData {
  jobId: string;
  jobTitle: string;
  department?: string;
  jobPostedDate?: string;
}

export async function getJobs(
  page = 1,
  limit = 20,
  search = "",
): Promise<JobsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  return apiFetch<JobsResponse>(`/jobs?${params.toString()}`);
}

export async function getJob(id: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}`);
}

export async function createJob(data: CreateJobData): Promise<Job> {
  return apiFetch<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteJob(id: string): Promise<void> {
  await apiFetch(`/jobs/${id}`, {
    method: "DELETE",
  });
}