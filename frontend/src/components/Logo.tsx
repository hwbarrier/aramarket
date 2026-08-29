export function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Logo moderne avec design géométrique simple */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <div className="absolute inset-0 bg-primary rounded-lg transform rotate-45"></div>
        <div className="absolute inset-1 bg-background rounded-sm transform rotate-45"></div>
        <div className="relative z-10 w-3 h-3 bg-primary rounded-full"></div>
      </div>
      <span className="font-bold text-xl text-primary">AraMarket</span>
    </div>
  );
}