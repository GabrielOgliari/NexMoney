export const AlertDialog = ({ children, open, onOpenChange }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          {children}
        </div>
      )}
    </>
  )
}

export const AlertDialogContent = ({ children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-background w-full max-w-sm rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  )
}
