import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useReviews } from "./useReviews";
import { AuthProvider } from "../contexts/AuthContext";
import { reviewService } from "../services/review.service";

vi.mock("../services/review.service", () => ({
  reviewService: { list: vi.fn(), create: vi.fn() },
}));

describe("useReviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("user", JSON.stringify({ id: "1", name: "Admin User", email: "admin@aramarket.fr", role: "admin", permissions: [], isVerified: true }));
  });

  it("loads reviews and adds a review for the authenticated user", async () => {
    vi.mocked(reviewService.list).mockResolvedValue([]);
    vi.mocked(reviewService.create).mockResolvedValue({
      id: "r1", targetType: "product", targetId: "p1", authorId: "1",
      authorName: "Admin User", rating: 5, comment: "Très bien", createdAt: "2024-01-01",
    });
    const { result } = renderHook(() => useReviews("product", "p1"), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });
    await waitFor(() => expect(reviewService.list).toHaveBeenCalled());
    await result.current.addReview(5, "Très bien");
    await waitFor(() => {
      expect(result.current.reviewCount).toBe(1);
      expect(result.current.averageRating).toBe(5);
    });
  });
});
