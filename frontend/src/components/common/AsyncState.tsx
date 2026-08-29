import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "../ui/button";

export function LoadingState({ label = "Chargement..." }: { label?: string }) {
  return <div className="flex min-h-[12rem] items-center justify-center p-6" role="status" aria-live="polite">{label}</div>;
}

export function ErrorState({ message = "Une erreur est survenue.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 p-6 text-center" role="alert">
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
      <p>{message}</p>
      {onRetry && <Button type="button" variant="outline" onClick={onRetry}>Réessayer</Button>}
    </div>
  );
}

export function EmptyState({ message = "Aucun résultat." }: { message?: string }) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center text-muted-foreground">
      <Inbox className="h-8 w-8" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
