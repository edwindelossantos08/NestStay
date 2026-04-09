interface PropertyImageProps {
  imageUrl?: string
  title: string
  id: number
  className?: string
  // 'card' para thumbnail, 'hero' para imagen grande de detalle
  variant?: 'card' | 'hero'
}

const PropertyImage = ({
  imageUrl,
  title,
  id,
  className,
  variant = 'card',
}: PropertyImageProps) => {
  // Unsplash como fallback con sig único por propiedad para consistencia
  const fallbackUrl = `https://source.unsplash.com/${
    variant === 'hero' ? '1200x500' : '400x300'
  }/?house,property,room&sig=${id}`

  return (
    <img
      src={imageUrl || fallbackUrl}
      alt={title}
      className={className}
      onError={(e) => {
        // Si la URL del host es inválida o falla, usar Unsplash
        if (e.currentTarget.src !== fallbackUrl) {
          e.currentTarget.src = fallbackUrl
        }
      }}
    />
  )
}

export default PropertyImage
