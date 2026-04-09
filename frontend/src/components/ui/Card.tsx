import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
}

export default function Card({ className, children, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80',
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
