import { apiFetch } from "./client";

export interface JoiningRecord {
  joiningId: string;
  applicationId: string;
  joiningDate: string | null;
  joiningStatus: string | null;
  createdAt: string;
}

export interface JoiningRecordsResponse {
  data: JoiningRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateJoiningRecordData {
  applicationId: string;
  joiningDate?: string;
  joiningStatus?: string;
}

export async function getJoiningRecords(
  page = 1,
  limit = 100,
): Promise<JoiningRecordsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<JoiningRecordsResponse>(
    `/joining-records?${params.toString()}`,
  );
}

export async function getJoiningRecord(
  id: string,
): Promise<JoiningRecord> {
  return apiFetch<JoiningRecord>(
    `/joining-records/${id}`,
  );
}

export async function createJoiningRecord(
  data: CreateJoiningRecordData,
): Promise<JoiningRecord> {
  return apiFetch<JoiningRecord>(
    "/joining-records",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function updateJoiningRecord(
  id: string,
  data: Partial<CreateJoiningRecordData>,
): Promise<JoiningRecord> {
  return apiFetch<JoiningRecord>(
    `/joining-records/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteJoiningRecord(
  id: string,
): Promise<void> {
  await apiFetch(`/joining-records/${id}`, {
    method: "DELETE",
  });
}