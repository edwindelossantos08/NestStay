
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { PropertyResponse } from '../../types/property.types'
import { getPropertyCoordinates, addJitter } from '../../utils/geocoding'

interface PropertyMapProps {
  // Para SearchPage: múltiples propiedades
  properties?: PropertyResponse[]
  // Para DetailPage: una sola propiedad
  property?: PropertyResponse
  className?: string
  // ID de la propiedad resaltada al hacer hover en SearchPage
  highlightedPropertyId?: number
}

// Ícono personalizado coral para propiedad resaltada
const highlightedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Ícono normal azul para propiedades no resaltadas
const defaultIcon = new L.Icon.Default()

const PropertyMap = ({
  properties,
  property,
  className,
  highlightedPropertyId
}: PropertyMapProps) => {

  // MODO DETALLE: una sola propiedad
  if (property) {
    const coords = getPropertyCoordinates(property)
    return (
      <MapContainer
        center={coords}
        zoom={14}
        className={className}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{property.title}</p>
              <p className="text-gray-500">📍 {property.location}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    )
  }

  // MODO BÚSQUEDA: múltiples propiedades
  if (properties && properties.length > 0) {
    // Centrar el mapa en el promedio de coordenadas de los resultados
    const coords = properties.map(p => getPropertyCoordinates(p))
    const centerLat = coords.reduce((s, c) => s + c[0], 0) / coords.length
    const centerLng = coords.reduce((s, c) => s + c[1], 0) / coords.length

    return (
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={9}
        className={className}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((p) => {
          const position = addJitter(getPropertyCoordinates(p))
          const isHighlighted = p.id === highlightedPropertyId
          return (
            <Marker
              key={p.id}
              position={position}
              icon={isHighlighted ? highlightedIcon : defaultIcon}
            >
              <Popup>
                <div className="text-sm min-w-[180px]">
                  <p className="font-semibold truncate">{p.title}</p>
                  <p className="text-gray-500 text-xs">📍 {p.location}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold">
                      ${p.pricePerNight}/noche
                    </span>
                    {p.averageRating > 0 && (
                      <span className="text-xs">⭐ {p.averageRating.toFixed(1)}</span>
                    )}
                  </div>
                  
                  <a
                    href={`/properties/${p.id}`}
                    className="block mt-2 text-center bg-[#1e3a5f] text-white
                               text-xs py-1 rounded-lg hover:bg-[#2d5a8f]"
                  >
                    Ver propiedad →
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    )
  }

  // Estado vacío si no hay propiedades
  return (
    <div className={`${className} flex items-center justify-center
                     bg-gray-100 rounded-2xl`}>
      <p className="text-gray-400 text-sm">Sin propiedades para mostrar</p>
    </div>
  )
}

// Exportación con lazy loading para evitar errores de SSR
export default PropertyMap
