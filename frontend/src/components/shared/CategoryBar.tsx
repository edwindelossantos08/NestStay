import { useState } from 'react'
import {
  Waves,
  TreePine,
  Building2,
  Castle,
  Tent,
  Sailboat,
  Mountain,
  Home,
  Flame,
  Palmtree,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'all',       label: 'Todo',        Icon: Home       },
  { id: 'beach',     label: 'Playa',       Icon: Waves      },
  { id: 'mountains', label: 'Montaña',     Icon: Mountain   },
  { id: 'forest',    label: 'Bosque',      Icon: TreePine   },
  { id: 'city',      label: 'Ciudad',      Icon: Building2  },
  { id: 'castles',   label: 'Castillos',   Icon: Castle     },
  { id: 'camping',   label: 'Camping',     Icon: Tent       },
  { id: 'boats',     label: 'Barcos',      Icon: Sailboat   },
  { id: 'tropical',  label: 'Tropical',    Icon: Palmtree   },
  { id: 'cabins',    label: 'Cabañas',     Icon: Flame      },
]

interface CategoryBarProps {
  /** Called when user selects a category (id string) */
  onChange?: (categoryId: string) => void
}

export default function CategoryBar({ onChange }: CategoryBarProps) {
  const [active, setActive] = useState('all')

  const handleSelect = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* scrollable row */}
        <div className="flex gap-6 overflow-x-auto py-3 scrollbar-hide justify-center">
          {CATEGORIES.map(({ id, label, Icon }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={`flex flex-shrink-0 flex-col items-center gap-1.5 pb-1 transition-colors duration-150 focus:outline-none ${
                  isActive
                    ? 'border-b-2 border-[#1e3a5f] text-[#1e3a5f]'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                <span className="whitespace-nowrap text-[11px] font-semibold tracking-wide">
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
