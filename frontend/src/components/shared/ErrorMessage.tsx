interface ErrorMessageProps {
  message?: string
}

export default function ErrorMessage({ message = 'Ocurrió un error inesperado.' }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  )
}
