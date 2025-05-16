export const Label = ({ children, className = "", ...props }) => {
  return (
    <label
      className={`text-sm font-medium text-foreground block ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
