import { apiFetch } from "./client";

export interface Resume {
  resumeId: string;
  candidateId: string;
  originalFilename: string;
  cloudinaryPublicId: string;
  mimeType: string;
  fileSize: number;
  cloudinaryUrl: string;
  uploadedAt: string;
  updatedAt: string;
}

interface ResumeResponse {
  data: Resume;
}

export async function getResume(
  candidateId: string,
): Promise<Resume | null> {
  try {
    const response = await apiFetch<ResumeResponse>(
      `/candidates/${candidateId}/resume`,
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (
      message.includes("404") ||
      message.toLowerCase().includes("not found")
    ) {
      return null;
    }

    throw error;
  }
}

export async function uploadResume(
  candidateId: string,
  file: File,
): Promise<Resume> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiFetch<ResumeResponse>(
    `/candidates/${candidateId}/resume`,
    {
      method: "POST",
      body: formData,
    },
  );

  return response.data;
}

export async function deleteResume(
  candidateId: string,
): Promise<void> {
  await apiFetch<void>(
    `/candidates/${candidateId}/resume`,
    {
      method: "DELETE",
    },
  );
}

export async function uploadApplicationResume(
  candidateId: string,
  applicationId: string,
  file: File,
): Promise<Resume> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiFetch<ResumeResponse>(
    `/candidates/${candidateId}/applications/${applicationId}/resume`,
    {
      method: "POST",
      body: formData,
    },
  );

  return response.data;
}