interface FlagProps {
  code?: string;
  className?: string;
}

// Bandeira via flag-icons (SVG). Quando não há time, mostra um marcador neutro.
export function Flag({ code, className = "" }: FlagProps) {
  if (!code) {
    return (
      <span
        className={`inline-block rounded-[3px] bg-edge ${className}`}
        aria-hidden
      />
    );
  }
  return <span className={`fi fi-${code} ${className}`} aria-hidden />;
}
