export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-dark mb-2">Términos y condiciones</h1>
      <p className="text-sm text-gray-400 mb-10">Última actualización: 1 de abril de 2026</p>

      <section className="space-y-10 text-gray-700 text-sm leading-7">

        <p>
          Bienvenido a <strong>NestStay</strong>. Al acceder o utilizar nuestra plataforma,
          aceptas quedar vinculado por los siguientes términos y condiciones. Por favor, léelos
          detenidamente antes de usar el servicio. Si no estás de acuerdo con alguno de ellos,
          no debes usar NestStay.
        </p>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">1. Sobre NestStay</h2>
          <p>
            NestStay es una plataforma en línea que conecta a personas que desean alquilar un
            espacio (hosts) con personas que buscan alojamiento temporal (huéspedes). NestStay
            actúa como intermediario y <strong>no es parte del contrato de hospedaje</strong> que
            se establece entre el host y el huésped. La responsabilidad sobre el alojamiento
            recae exclusivamente en el host.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">2. Elegibilidad</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Debes tener al menos 18 años para crear una cuenta y usar NestStay.</li>
            <li>Debes proporcionar información verdadera, completa y actualizada al registrarte.</li>
            <li>
              No puedes crear una cuenta si hemos suspendido o eliminado previamente tu acceso
              por incumplimiento de estos términos.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">3. Cuentas de usuario</h2>
          <p className="mb-3">
            Eres responsable de mantener la confidencialidad de tus credenciales de acceso.
            Cualquier actividad realizada desde tu cuenta es tu responsabilidad. Debes:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Notificarnos de inmediato ante cualquier acceso no autorizado a tu cuenta.</li>
            <li>No compartir tu contraseña con terceros.</li>
            <li>No usar la cuenta de otro usuario sin su consentimiento explícito.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">4. Publicación de propiedades (Hosts)</h2>
          <p className="mb-3">Si publicas una propiedad en NestStay, garantizas que:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Tienes el derecho legal de arrendar el inmueble.</li>
            <li>La información del alojamiento (fotos, descripción, precio, amenidades) es verídica y está actualizada.</li>
            <li>Cumplirás con todas las leyes locales aplicables al alquiler a corto plazo.</li>
            <li>Mantendrás el alojamiento en condiciones seguras e higiénicas para los huéspedes.</li>
            <li>Responderás a las solicitudes de reserva en un plazo razonable.</li>
          </ul>
          <p className="mt-3">
            NestStay se reserva el derecho de retirar cualquier publicación que no cumpla con
            estos estándares, sin previo aviso.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">5. Reservas y pagos</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              Al confirmar una reserva, el huésped acepta pagar el monto total indicado, incluyendo
              la tarifa de servicio de NestStay.
            </li>
            <li>
              El pago es procesado de forma segura por nuestros proveedores certificados. NestStay
              retiene el pago hasta 24 horas después del check-in antes de liberarlo al host.
            </li>
            <li>
              NestStay cobra una <strong>tarifa de servicio al huésped</strong> de entre el 6% y
              el 12% del subtotal de la reserva, dependiendo de su duración y monto.
            </li>
            <li>
              Los hosts pagan una <strong>comisión del 3%</strong> sobre cada reserva completada.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">6. Política de cancelación</h2>
          <p className="mb-3">
            Cada propiedad puede tener su propia política de cancelación, definida por el host y
            visible antes de confirmar la reserva. En general, aplicamos tres niveles:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Flexible:</strong> reembolso completo si se cancela con al menos 24 horas de anticipación.</li>
            <li><strong>Moderada:</strong> reembolso completo si se cancela con al menos 5 días de anticipación.</li>
            <li><strong>Estricta:</strong> reembolso del 50% si se cancela con al menos 7 días de anticipación.</li>
          </ul>
          <p className="mt-3">
            La tarifa de servicio de NestStay no es reembolsable salvo que la cancelación sea
            responsabilidad del host.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">7. Conducta del usuario</h2>
          <p className="mb-3">Al usar NestStay, te comprometes a no:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Publicar contenido falso, engañoso o fraudulento.</li>
            <li>Acosar, intimidar o discriminar a otros usuarios.</li>
            <li>Usar la plataforma para actividades ilegales de cualquier tipo.</li>
            <li>Intentar eludir nuestros sistemas de pago realizando transacciones fuera de la plataforma.</li>
            <li>Copiar, vender o explotar cualquier parte de la plataforma sin autorización escrita.</li>
            <li>Publicar contenido que infrinja derechos de autor, marcas registradas o privacidad ajena.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">8. Reseñas</h2>
          <p>
            Las reseñas deben ser honestas y basadas en experiencias reales. Está prohibido
            publicar reseñas falsas, pagar por reseñas positivas o presionar a otros usuarios para
            modificar sus opiniones. NestStay puede eliminar reseñas que violen estas normas sin
            necesidad de justificación.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">9. Propiedad intelectual</h2>
          <p>
            Todo el contenido de NestStay (logo, diseño, código, textos e imágenes propios) es
            propiedad de NestStay, Inc. o sus licenciantes. Al subir fotos o descripciones a la
            plataforma, nos otorgas una licencia no exclusiva para usarlas con el fin de operar y
            promocionar el servicio.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">10. Limitación de responsabilidad</h2>
          <p>
            NestStay no garantiza la exactitud de los listados ni la conducta de hosts o huéspedes.
            En la máxima medida permitida por la ley, NestStay no será responsable por daños
            indirectos, incidentales, especiales o consecuentes que resulten del uso del servicio,
            incluyendo pérdida de datos, daños a la propiedad o lesiones personales ocurridas
            durante una estadía.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">11. Suspensión y terminación</h2>
          <p>
            NestStay puede suspender o eliminar tu cuenta en cualquier momento si incumples estos
            términos, sin necesidad de previo aviso. También puedes eliminar tu cuenta en cualquier
            momento desde la configuración de tu perfil.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">12. Ley aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa
            relacionada con el uso de NestStay será resuelta en los tribunales competentes de
            Santo Domingo, salvo que la ley aplicable establezca otra jurisdicción.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">13. Cambios a estos términos</h2>
          <p>
            Podemos modificar estos términos en cualquier momento. Te notificaremos por correo
            electrónico o mediante un aviso destacado en la plataforma con al menos 15 días de
            anticipación. El uso continuado del servicio tras esa fecha implica tu aceptación.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-dark mb-3">14. Contacto</h2>
          <p>
            Para preguntas sobre estos términos, escríbenos a:
          </p>
          <address className="not-italic mt-3 space-y-1 text-gray-600">
            <p><strong>NestStay, Inc.</strong></p>
            <p>Departamento Legal</p>
            <p>
              <a href="mailto:legal@neststay.com" className="text-coral hover:underline">
                legal@neststay.com
              </a>
            </p>
          </address>
        </div>

      </section>
    </div>
  )
}
