import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '../utils/cn'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextType {
  showToast: (opts: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((opts: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    // Máximo 3 toasts apilados
    setToasts((prev) => [...prev.slice(-2), { ...opts, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            open={true}
            onOpenChange={(open) => !open && removeToast(toast.id)}
            duration={4000}
            className={cn(
              'flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg',
              {
                'border-green-200 bg-green-50': toast.variant === 'success',
                'border-red-200 bg-red-50': toast.variant === 'error',
                'border-blue-200 bg-blue-50': toast.variant === 'info',
              }
            )}
          >
            <div className="flex-1 min-w-0">
              <ToastPrimitive.Title className="text-sm font-semibold text-gray-900">
                {toast.variant === 'success' && '✅ '}
                {toast.variant === 'error' && '❌ '}
                {toast.variant === 'info' && 'ℹ️ '}
                {toast.title}
              </ToastPrimitive.Title>
              {toast.description && (
                <ToastPrimitive.Description className="mt-1 text-xs text-gray-600">
                  {toast.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close asChild>
              <button
                className="rounded p-0.5 hover:bg-black/10 shrink-0"
                onClick={() => removeToast(toast.id)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}

        {/* Portal donde se renderizan los toasts — esquina inferior derecha */}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-h-screen outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')

  return {
    success: (title: string, description?: string) =>
      ctx.showToast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) =>
      ctx.showToast({ title, description, variant: 'error' }),
    info: (title: string, description?: string) =>
      ctx.showToast({ title, description, variant: 'info' }),
  }
}
