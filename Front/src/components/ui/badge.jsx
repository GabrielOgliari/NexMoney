export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-muted text-foreground",
    success: "bg-green-500/20 text-green-600",
    destructive: "bg-red-500/20 text-red-600",
    outline: "border border-border text-foreground",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
