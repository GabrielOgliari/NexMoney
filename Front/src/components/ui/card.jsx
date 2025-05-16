export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-card text-card-foreground rounded-lg border border-border shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = "" }) => {
  return <div className={`p-4 border-b border-border ${className}`}>{children}</div>
}

export const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-lg font-semibold leading-none ${className}`}>{children}</h3>
}

export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}
