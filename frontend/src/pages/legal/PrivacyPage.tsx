export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-dark mb-2">Política de privacidad</h1>
      <p className="text-sm text-gray-400 mb-10">Última actualización: 1 de abril de 2026</p>

      <section className="space-y-10 text-gray-700 text-sm leading-7">

        <p>
          En <strong>NestStay, Inc.</strong> nos tomamos tu privacidad muy en serio. Esta política
          explica qué información recopilamos, cómo la usamos y qué derechos tienes sobre ella
          cuando utilizas nuestra plataforma, ya sea como huésped o como host.
        </p>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">1. Información que recopilamos</h2>
          <p className="mb-3">Recopilamos información en tres grandes categorías:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Información de cuenta:</strong> nombre completo, correo electrónico, número de
              teléfono, foto de perfil y contraseña cifrada al momento del registro.
            </li>
            <li>
              <strong>Información de reservas:</strong> fechas de entrada y salida, número de
              huéspedes, historial de propiedades visitadas, reseñas escritas y recibidas.
            </li>
            <li>
              <strong>Información de pago:</strong> los datos de tarjeta o método de pago son
              procesados directamente por nuestros proveedores certificados (PCI-DSS). NestStay
              nunca almacena números de tarjeta completos.
            </li>
            <li>
              <strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo, navegador,
              páginas visitadas y tiempos de sesión, recopilados de forma automática.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">2. Cómo usamos tu información</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Crear y gestionar tu cuenta en la plataforma.</li>
            <li>Procesar y confirmar reservas entre huéspedes y hosts.</li>
            <li>Enviarte correos de confirmación, recordatorios y notificaciones relevantes.</li>
            <li>Personalizar el contenido y las recomendaciones que ves en tu inicio.</li>
            <li>Detectar y prevenir fraudes, abusos o actividades sospechosas.</li>
            <li>Mejorar nuestros servicios mediante análisis de uso agregado y anonimizado.</li>
            <li>Cumplir con obligaciones legales y regulatorias aplicables.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">3. Compartir tu información</h2>
          <p className="mb-3">
            No vendemos ni alquilamos tu información personal a terceros. Sin embargo, podemos
            compartirla en los siguientes casos:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Con hosts:</strong> al confirmar una reserva, el host recibe tu nombre,
              foto de perfil y detalles de la estadía.
            </li>
            <li>
              <strong>Con proveedores de servicio:</strong> empresas que nos ayudan a procesar
              pagos, enviar correos o analizar el rendimiento de la plataforma, bajo acuerdos de
              confidencialidad estrictos.
            </li>
            <li>
              <strong>Por requerimiento legal:</strong> cuando sea necesario para cumplir una
              orden judicial, ley aplicable o proceso gubernamental válido.
            </li>
            <li>
              <strong>En caso de fusión o adquisición:</strong> si NestStay es adquirida o se
              fusiona con otra empresa, tu información puede ser transferida como parte del proceso.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">4. Cookies y tecnologías de seguimiento</h2>
          <p>
            Usamos cookies propias y de terceros para mantener tu sesión activa, recordar tus
            preferencias y analizar el tráfico de la plataforma. Puedes controlar el uso de cookies
            desde la configuración de tu navegador, aunque desactivarlas puede afectar algunas
            funciones del sitio.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">5. Retención de datos</h2>
          <p>
            Conservamos tu información mientras tu cuenta esté activa o según sea necesario para
            prestarte los servicios. Si eliminas tu cuenta, tus datos personales serán borrados
            dentro de los 30 días siguientes, salvo que debamos conservarlos por obligaciones
            legales o resolver disputas pendientes.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">6. Seguridad</h2>
          <p>
            Aplicamos cifrado TLS en todas las comunicaciones, almacenamos contraseñas con hashing
            seguro (bcrypt) y limitamos el acceso interno a tu información solo al personal que lo
            necesita. Aunque hacemos todo lo posible por protegerte, ningún sistema digital es
            completamente infalible.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">7. Tus derechos</h2>
          <p className="mb-3">Dependiendo de tu país de residencia, puedes tener derecho a:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Acceder a los datos personales que tenemos sobre ti.</li>
            <li>Corregir información incorrecta o desactualizada.</li>
            <li>Solicitar la eliminación de tu cuenta y datos asociados.</li>
            <li>Oponerte al tratamiento de tu información para fines de marketing.</li>
            <li>Portabilidad de tus datos en formato legible por máquina.</li>
          </ul>
          <p className="mt-3">
            Para ejercer cualquiera de estos derechos, escríbenos a{' '}
            <a href="mailto:privacidad@neststay.com" className="text-coral hover:underline">
              privacidad@neststay.com
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">8. Menores de edad</h2>
          <p>
            NestStay no está dirigida a personas menores de 18 años. No recopilamos
            intencionalmente información de menores. Si descubres que un menor ha creado una
            cuenta, contáctanos para eliminarla de inmediato.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">9. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política periódicamente. Te notificaremos por correo electrónico
            o mediante un aviso en la plataforma antes de que los cambios entren en vigor. El uso
            continuado de NestStay tras la notificación implica tu aceptación.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">10. Contacto</h2>
          <p>
            Si tienes preguntas, inquietudes o solicitudes relacionadas con tu privacidad,
            contáctanos en:
          </p>
          <address className="not-italic mt-3 space-y-1 text-gray-600">
            <p><strong>NestStay, Inc.</strong></p>
            <p>Área legal y privacidad</p>
            <p>
              <a href="mailto:privacidad@neststay.com" className="text-coral hover:underline">
                privacidad@neststay.com
              </a>
            </p>
          </address>
        </div>

      </section>
    </div>
  )
}
