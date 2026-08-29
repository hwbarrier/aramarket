import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { reviewService } from "../services/review.service";
import { Review } from "../types/review";

export function useReviews(targetType: Review["targetType"], targetId: string) {
  const { authState } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      setReviews(await reviewService.list(targetType, targetId));
    } catch {
      setError("Impossible de charger les avis.");
    }
  }, [targetId, targetType]);

  useEffect(() => { void refresh(); }, [refresh]);
  const averageRating = useMemo(() => reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0, [reviews]);
  const addReview = useCallback(async (rating: number, comment: string) => {
    const authorId = authState.user?.id;
    if (!authorId) throw new Error("Connexion requise pour déposer un avis.");
    if (reviews.some(review => review.authorId === authorId)) throw new Error("Vous avez déjà évalué cette cible.");
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment.trim()) throw new Error("Note et commentaire requis.");
    const review = await reviewService.create({ targetType, targetId, authorId, authorName: authState.user?.name || "Client", rating, comment: comment.trim() });
    setReviews(current => [review, ...current]);
  }, [authState.user, reviews, targetId, targetType]);

  return { reviews, averageRating, reviewCount: reviews.length, addReview, refresh, error };
}
