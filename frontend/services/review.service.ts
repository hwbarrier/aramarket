import { api } from "../api/client";
import { Review } from "../types/review";

export function sanitizeReviewText(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export const reviewService = {
  async list(targetType: Review["targetType"], targetId: string): Promise<Review[]> {
    const response = await api.get<Review[] | { results: Review[] }>(`/reviews/?target_type=${encodeURIComponent(targetType)}&target_id=${encodeURIComponent(targetId)}`);
    return Array.isArray(response.data) ? response.data : response.data.results;
  },
  async create(input: Omit<Review, "id" | "createdAt">): Promise<Review> {
    const safeInput = { ...input, authorName: sanitizeReviewText(input.authorName), comment: sanitizeReviewText(input.comment) };
    const response = await api.post<Review>("/reviews/", safeInput);
    return response.data;
  },
};
