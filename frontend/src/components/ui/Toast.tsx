import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ToastProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

export default function Toast({ open, onClose, title, description, variant = 'default' }: ToastProps) {
  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={(v) => !v && onClose()}
        className={cn(
          'fixed bottom-4 right-4 z-50 flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg',
          {
            'border-gray-200 bg-white': variant === 'default',
            'border-green-200 bg-green-50': variant === 'success',
            'border-red-200 bg-red-50': variant === 'error',
          }
        )}
      >
        <div className="flex-1">
          <ToastPrimitive.Title className="text-sm font-semibold text-gray-900">
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description className="mt-1 text-xs text-gray-600">
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
        <ToastPrimitive.Close asChild>
          <button className="rounded p-0.5 hover:bg-gray-100" onClick={onClose}>
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  )
}
