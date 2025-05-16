import { useState } from "react"

export const Dialog = ({ children, open, onOpenChange }) => {
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

export const DialogTrigger = ({ children, asChild = false }) =>
  asChild ? children : <button>{children}</button>

export const DialogContent = ({ children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-background w-full max-w-md rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  )
}
