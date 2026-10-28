import { getSettings, whatsappHref } from '@/lib/queries'

/**
 * The reference's round WhatsApp button, fixed to the corner of every page, in the site's
 * ink and brass instead of WhatsApp green. Its label is real text: hidden on a phone, it
 * slides out beside the mark on hover where there is room.
 */
export async function WhatsAppFloat() {
  const { whatsapp, messageGeneral, chatLabel } = await getSettings()

  return (
    <a
      href={whatsappHref(whatsapp, messageGeneral)}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <span className="whatsapp-float-label">{chatLabel}</span>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M20.52 3.48A11.8 11.8 0 0 0 12.1 0C5.56 0 .24 5.31.24 11.85c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.9 11.9 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.24-6.15-3.45-8.41Zm-8.41 18.26a9.85 9.85 0 0 1-5.03-1.38l-.36-.21-3.77.99 1.01-3.67-.24-.38a9.83 9.83 0 0 1-1.51-5.24c0-5.45 4.44-9.89 9.9-9.89a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.9 7c0 5.45-4.44 9.88-9.9 9.88Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.66-.51h-.57c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.5 1.69.64.71.23 1.36.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </a>
  )
}
