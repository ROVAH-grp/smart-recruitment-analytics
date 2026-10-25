import { apiFetch } from "./client";

export interface Source {
  sourceId: number;
  sourceName: string;
  createdAt: string;
}

export interface SourcesResponse {
  data: Source[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateSourceData {
  sourceName: string;
}

export async function getSources(
  page = 1,
  limit = 100,
): Promise<SourcesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<SourcesResponse>(
    `/sources?${params.toString()}`,
  );
}

export async function getSource(id: number): Promise<Source> {
  return apiFetch<Source>(`/sources/${id}`);
}

export async function createSource(
  data: CreateSourceData,
): Promise<Source> {
  return apiFetch<Source>("/sources", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSource(
  id: number,
  data: Partial<CreateSourceData>,
): Promise<Source> {
  return apiFetch<Source>(`/sources/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteSource(id: number): Promise<void> {
  await apiFetch(`/sources/${id}`, {
    method: "DELETE",
  });
}