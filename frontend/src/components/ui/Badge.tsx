import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'confirmed' | 'cancelled' | 'completed' | 'unread' | 'default'
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-gray-100 text-gray-700': variant === 'default',
          'bg-green-100 text-green-800': variant === 'confirmed',
          'bg-red-100 text-red-800': variant === 'cancelled',
          'bg-blue-100 text-blue-800': variant === 'completed',
          'bg-amber-100 text-amber-800': variant === 'unread',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
