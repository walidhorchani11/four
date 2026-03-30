export function getWhatsAppNumber(): string | undefined {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
}

export function getWhatsAppHref(): string {
  const n = getWhatsAppNumber()
  return n ? `https://wa.me/${n}` : '#'
}
