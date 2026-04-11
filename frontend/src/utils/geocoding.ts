import type { PropertyResponse } from '../types/property.types'

// Coordenadas de ciudades dominicanas frecuentes como fallback
// Se usa cuando la propiedad no tiene Latitude/Longitude en la BD
const dominicanCities: Record<string, [number, number]> = {
  'santo domingo': [18.4861, -69.9312],
  'santiago':      [19.4517, -70.6970],
  'punta cana':    [18.5601, -68.3725],
  'la romana':     [18.4273, -68.9728],
  'puerto plata':  [19.7932, -70.6881],
  'samana':        [19.2060, -69.3362],
  'boca chica':    [18.4487, -69.6049],
  'bavaro':        [18.7200, -68.4500],
  'jarabacoa':     [19.1193, -70.6389],
  'constanza':     [18.9076, -70.7489],
  'sosua':         [19.7588, -70.5204],
  'cabarete':      [19.7481, -70.4086],
}

// Retorna coordenadas de la propiedad o hace fallback por ciudad
export const getPropertyCoordinates = (
  property: PropertyResponse
): [number, number] => {
  // Primero intenta usar las coordenadas reales de la BD
  if (property.latitude && property.longitude) {
    return [property.latitude, property.longitude]
  }

  // Fallback: busca por nombre de ciudad en el campo location
  const normalized = property.location.toLowerCase().trim()
  for (const [city, coords] of Object.entries(dominicanCities)) {
    if (normalized.includes(city)) return coords
  }

  // Default: centro de República Dominicana
  return [18.7357, -70.1627]
}

// Agrega pequeño offset aleatorio para que marcadores cercanos
// no se superpongan exactamente en el mapa
export const addJitter = (
  coords: [number, number],
  amount = 0.008
): [number, number] => ([
  coords[0] + (Math.random() - 0.5) * amount,
  coords[1] + (Math.random() - 0.5) * amount,
])
