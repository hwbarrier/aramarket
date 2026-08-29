export function LoadingScreen() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center" role="status" aria-live="polite">
      <span className="text-muted-foreground">Chargement...</span>
    </div>
  );
}
