import { ChevronRight, Home } from "lucide-react";
import { Button } from "./ui/button";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  onHomeClick?: () => void;
}

export function Breadcrumb({ 
  items, 
  className = "", 
  showHome = true,
  onHomeClick 
}: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm overflow-x-auto ${className}`}>
      {showHome && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onHomeClick}
            className="h-auto p-1 text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <Home className="h-4 w-4" />
          </Button>
          {items.length > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 flex-shrink-0">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={item.onClick}
            className={`h-auto p-1 whitespace-nowrap ${
              index === items.length - 1
                ? "text-foreground font-medium cursor-default"
                : "text-muted-foreground hover:text-foreground"
            }`}
            disabled={index === items.length - 1 && !item.onClick}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  );
}