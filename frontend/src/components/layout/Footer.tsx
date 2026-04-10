import { Globe } from 'lucide-react'

// Minimal inline SVG wrappers for social icons removed from lucide-react v1
const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/>
  </svg>
)
const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)


const footerSections = [
  {
    title: 'Soporte',
    links: [
      'Centro de ayuda',
      'AirCover',
      'Información de seguridad',
      'Opciones de cancelación',
      'Reporte de problema',
    ],
  },
  {
    title: 'Comunidad',
    links: [
      'Foros NestStay',
      'Accesibilidad',
      'NestStay para el trabajo',
      'Invita a amigos',
    ],
  },
  {
    title: 'Hospedaje',
    links: [
      'Crea tu anuncio',
      'Protección para hosts',
      'Recursos para hosts',
      'Comunidad de hosts',
      'Hospedaje responsable',
    ],
  },
  {
    title: 'NestStay',
    links: [
      'Sala de prensa',
      'Novedades',
      'Empleos',
      'Inversores',
      'Política de privacidad',
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Main multi-column section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-dark mb-4">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-dark transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright + lang/currency */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} NestStay, Inc.</span>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:text-dark transition-colors">Privacidad</a>
            <span>·</span>
            <a href="#" className="hover:text-dark transition-colors">Términos</a>
            <span>·</span>
            <a href="#" className="hover:text-dark transition-colors">Mapa del sitio</a>
            <span className="hidden sm:inline">·</span>
            <button className="hidden sm:flex items-center gap-1.5 hover:text-dark transition-colors">
              <Globe className="h-4 w-4" />
              Español (ES)
            </button>
            <button className="hidden sm:flex items-center gap-1.5 hover:text-dark transition-colors">
              $ USD
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-gray-500">
            <a href="#" aria-label="Facebook" className="hover:text-dark transition-colors">
              <FacebookIcon />
            </a>
            <a href="#" aria-label="Twitter/X" className="hover:text-dark transition-colors">
              <TwitterIcon />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-dark transition-colors">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
