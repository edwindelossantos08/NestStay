import { cn } from '../../utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ size = 'md', className, fullScreen = false }: LoadingSpinnerProps) {
  const spinner = (
    <svg
      className={cn(
        'animate-spin text-navy',
        {
          'h-5 w-5': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        },
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
