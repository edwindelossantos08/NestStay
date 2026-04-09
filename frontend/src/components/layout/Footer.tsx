export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} NestStay. Todos los derechos reservados.
      </div>
    </footer>
  )
}
