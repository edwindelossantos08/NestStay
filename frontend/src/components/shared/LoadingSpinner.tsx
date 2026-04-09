import { cn } from '../../utils/cn'

interface LoadingSpinnerProps {
  className?: string
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-rose-500',
        className
      )}
    />
  )
}
