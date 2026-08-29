import { FormEvent, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useReviews } from "../hooks/useReviews";
import { Review } from "../types/review";
import { sanitizeReviewText } from "../services/review.service";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";

export function ReviewSection({ targetType, targetId }: { targetType: Review["targetType"]; targetId: string }) {
  const { authState } = useAuth();
  const { reviews, averageRating, reviewCount, addReview, error } = useReviews(targetType, targetId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try { await addReview(rating, comment); setComment(""); setMessage("Merci pour votre avis."); } catch (submitError) { setMessage(submitError instanceof Error ? submitError.message : "Impossible de publier l'avis."); }
  };
  return <Card><CardHeader><CardTitle>Avis ({reviewCount}) {reviewCount > 0 && <span className="text-sm font-normal text-muted-foreground">· {averageRating.toFixed(1)}/5</span>}</CardTitle></CardHeader><CardContent className="space-y-4">
    {error && <p className="text-sm text-destructive">{error}</p>}
    {reviews.map(review => <div key={review.id} className="border-b pb-3 last:border-0"><div className="flex items-center gap-2"><span className="font-medium">{sanitizeReviewText(review.authorName)}</span><span className="text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></div><p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</p><p className="mt-1">{sanitizeReviewText(review.comment)}</p></div>)}
    {authState.isAuthenticated ? <form onSubmit={submit} className="space-y-3 border-t pt-4"><div className="flex items-center gap-2"><label htmlFor={`${targetType}-rating`}>Note</label><select id={`${targetType}-rating`} value={rating} onChange={event => setRating(Number(event.target.value))} className="rounded border bg-background p-1">{[1,2,3,4,5].map(value => <option key={value} value={value}>{value}/5</option>)}</select></div><Textarea value={comment} onChange={event => setComment(event.target.value)} placeholder="Partagez votre expérience" required /><Button type="submit">Publier l'avis</Button>{message && <p className="text-sm text-muted-foreground">{message}</p>}</form> : <p className="text-sm text-muted-foreground">Connectez-vous pour laisser un avis.</p>}
  </CardContent></Card>;
}
