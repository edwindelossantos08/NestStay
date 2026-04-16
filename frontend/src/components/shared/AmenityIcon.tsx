import {
  Wifi, UtensilsCrossed, Wind, Flame, Tv, Waves,
  Droplets, Dumbbell, Sun, AlertTriangle, Shield,
  Heart, Car, Mountain, Star,
} from 'lucide-react'

// Mapa de nombres de íconos a componentes de Lucide
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Wifi':            Wifi,
  'UtensilsCrossed': UtensilsCrossed,
  'WashingMachine':  Waves,
  'Wind':            Wind,
  'Flame':           Flame,
  'Tv':              Tv,
  'Waves':           Waves,
  'Droplets':        Droplets,
  'Dumbbell':        Dumbbell,
  'Sun':             Sun,
  'AlertTriangle':   AlertTriangle,
  'Shield':          Shield,
  'Heart':           Heart,
  'Car':             Car,
  'Mountain':        Mountain,
}

interface AmenityIconProps {
  iconName: string
  size?: number
  className?: string
}

const AmenityIcon = ({ iconName, size = 20, className }: AmenityIconProps) => {
  // Si no encuentra el ícono usa Star como fallback
  const IconComponent = iconMap[iconName] || Star
  return <IconComponent size={size} className={className} />
}

export default AmenityIcon
