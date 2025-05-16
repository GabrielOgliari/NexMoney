export const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring ${className}`}
      {...props}
    />
  )
}
