import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { type UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '../../utils/cn'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof UseFormRegisterReturn> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  register?: UseFormRegisterReturn
  disabled?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, register, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          {/* Ícono izquierdo opcional */}
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400',
              'focus:border-navy focus:ring-2 focus:ring-navy/20',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              leftIcon && 'pl-10',
              className
            )}
            {...register}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
