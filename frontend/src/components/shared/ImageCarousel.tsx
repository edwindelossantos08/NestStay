import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PropertyImageResponse } from '../../types/property.types'
import PropertyImage from './PropertyImage'
import { cn } from '../../utils/cn'

interface ImageCarouselProps {
  images: PropertyImageResponse[]
  imageUrl?: string
  title: string
  propertyId: number
}

const ImageCarousel = ({ images, imageUrl, title, propertyId }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Construye la lista final de URLs a mostrar
  const getImageList = (): string[] => {
    if (images && images.length > 0) {
      return images
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(img => img.url)
    }
    // Fallback a la imagen única o Unsplash
    return [imageUrl || `https://source.unsplash.com/400x300/?house&sig=${propertyId}`]
  }

  const imageList = getImageList()
  const hasMultiple = imageList.length > 1

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-2xl group">
      {/* Imágenes apiladas con transición de opacidad */}
      {imageList.map((url, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <PropertyImage
            imageUrl={url}
            title={title}
            id={propertyId}
            variant="card"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Botón anterior — solo si hay más de una imagen */}
      {hasMultiple && currentIndex > 0 && (
        <button
          onClick={(e) => {
            // Evita navegar al detalle al hacer click en los botones
            e.preventDefault()
            e.stopPropagation()
            setCurrentIndex(prev => prev - 1)
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Botón siguiente — solo si hay más de una imagen */}
      {hasMultiple && currentIndex < imageList.length - 1 && (
        <button
          onClick={(e) => {
            // Evita navegar al detalle al hacer click en los botones
            e.preventDefault()
            e.stopPropagation()
            setCurrentIndex(prev => prev + 1)
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Dots de navegación — solo si hay más de una imagen */}
      {hasMultiple && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {imageList.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentIndex(i)
              }}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === currentIndex ? 'bg-white w-3' : 'bg-white/60 w-1.5'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel
