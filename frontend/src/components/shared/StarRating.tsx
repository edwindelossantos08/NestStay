import { useState } from 'react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md'
  interactive?: boolean
  onChange?: (rating: number) => void
}

const StarRating = ({
  rating,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onChange,
}: StarRatingProps) => {
  // Preview de rating al hacer hover en modo interactivo
  const [hovered, setHovered] = useState(0)

  const starSize = size === 'sm' ? 'text-sm' : 'text-xl'
  const displayed = interactive && hovered > 0 ? hovered : rating

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const value = i + 1
        const filled = value <= displayed

        return (
          <span
            key={i}
            className={`${starSize} ${filled ? 'text-[#c9a84c]' : 'text-gray-300'} ${
              interactive ? 'cursor-pointer transition-colors duration-100' : ''
            }`}
            onMouseEnter={() => interactive && setHovered(value)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(value)}
            role={interactive ? 'button' : undefined}
            aria-label={interactive ? `${value} estrella${value > 1 ? 's' : ''}` : undefined}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

export default StarRating
