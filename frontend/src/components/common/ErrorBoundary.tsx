import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Application error", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
          <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
          <p className="text-muted-foreground">Rechargez la page pour reprendre votre navigation.</p>
          <Button onClick={() => window.location.reload()}>Recharger</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
