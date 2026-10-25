import { apiFetch } from "./client";

export interface Offer {
  offerId: string;
  applicationId: string;
  offerDate: string | null;
  offerStatus: string | null;
  createdAt: string;
}

export interface OffersResponse {
  data: Offer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateOfferData {
  applicationId: string;
  offerDate?: string;
  offerStatus?: string;
}

export async function getOffers(
  page = 1,
  limit = 100,
): Promise<OffersResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<OffersResponse>(
    `/offers?${params.toString()}`,
  );
}

export async function getOffer(id: string): Promise<Offer> {
  return apiFetch<Offer>(`/offers/${id}`);
}

export async function createOffer(
  data: CreateOfferData,
): Promise<Offer> {
  return apiFetch<Offer>("/offers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOffer(
  id: string,
  data: Partial<CreateOfferData>,
): Promise<Offer> {
  return apiFetch<Offer>(`/offers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOffer(id: string): Promise<void> {
  await apiFetch(`/offers/${id}`, {
    method: "DELETE",
  });
}