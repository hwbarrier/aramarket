import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function PageNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Page introuvable</h1>
      <p className="text-muted-foreground">Cette adresse ne correspond à aucune page AraMarket.</p>
      <Button asChild>
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
