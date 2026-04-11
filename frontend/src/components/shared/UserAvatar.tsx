import { useState } from 'react'
import { cn } from '../../utils/cn'

interface UserAvatarProps {
  name: string
  avatarUrl?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// Genera color de fondo basado en el nombre para consistencia
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-400',   'bg-orange-400', 'bg-amber-400',
    'bg-green-400', 'bg-teal-400',   'bg-blue-400',
    'bg-indigo-400','bg-purple-400', 'bg-pink-400',
  ]
  // Usa la suma de códigos char del nombre para elegir color
  const index = name.split('').reduce(
    (sum, char) => sum + char.charCodeAt(0), 0
  ) % colors.length
  return colors[index]
}

// Genera las iniciales del nombre
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('')
}

const sizeClasses = {
  xs:  'w-6  h-6  text-xs',
  sm:  'w-8  h-8  text-sm',
  md:  'w-10 h-10 text-base',
  lg:  'w-14 h-14 text-xl',
  xl:  'w-20 h-20 text-2xl',
}

const UserAvatar = ({ name, avatarUrl, size = 'md', className }: UserAvatarProps) => {
  const [imgError, setImgError] = useState(false)

  // Muestra imagen real si existe y no falló
  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          sizeClasses[size],
          className
        )}
        onError={() => setImgError(true)}
      />
    )
  }

  // Fallback: círculo con iniciales y color generado
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0',
        sizeClasses[size],
        getAvatarColor(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}

export default UserAvatar
