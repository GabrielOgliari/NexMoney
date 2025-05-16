export const Badge = ({ children, variant = "default", className = "" }) => {
  const base = "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors";

  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border text-foreground",
    success: "bg-green-500 text-white",
    destructive: "bg-red-500 text-white",
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
};
