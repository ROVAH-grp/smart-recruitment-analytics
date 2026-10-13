const API_BASE_URL =
(import.meta.env.VITE_API_URL as string | undefined) ??
"https://smart-recruitment-backend-new.onrender.com/api";


export async function apiFetch<T>(
endpoint: string,
options?: RequestInit,
): Promise<T> {
const headers = new Headers(options?.headers);
const isFormData = options?.body instanceof FormData;

if (!isFormData && !headers.has("Content-Type")) {
headers.set("Content-Type", "application/json");
}

const token = localStorage.getItem("smart_recruitment_token");

if (token && !headers.has("Authorization")) {
headers.set("Authorization", `Bearer ${token}`);
}

const response = await fetch(`${API_BASE_URL}${endpoint}`, {
...options,
headers,
});

if (!response.ok) {
const errorText = await response.text();
throw new Error(errorText || `API error: ${response.status}`);
}

if (response.status === 204) {
return undefined as T;
}

return response.json();
}

export async function apiDownload(
endpoint: string,
filename: string,
): Promise<void> {
const token = localStorage.getItem("smart_recruitment_token");

const response = await fetch(`${API_BASE_URL}${endpoint}`, {
headers: token ? { Authorization: `Bearer ${token}` } : undefined,
});

if (!response.ok) {
const errorText = await response.text();
throw new Error(errorText || `API error: ${response.status}`);
}

const blob = await response.blob();
const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = filename;

document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);
}
