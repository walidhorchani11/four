/**
 * Validation des numéros tunisiens (E.164 +216, NSN 8 chiffres).
 * Mobile : 2, 4, 5, 9 — fixe géographique : souvent 7…
 */

const TUNISIAN_NSN = /^[24579]\d{7}$/

export function digitsOnly(input: string): string {
  return input.replace(/\D/g, '')
}

/** Extrait les 8 chiffres nationaux si le format est valide, sinon null. */
export function normalizeToTunisianNational8(input: string): string | null {
  let d = digitsOnly(input)
  if (d.startsWith('00216')) d = d.slice(5)
  else if (d.startsWith('216')) d = d.slice(3)
  else if (d.startsWith('0') && d.length === 9) d = d.slice(1)

  if (d.length !== 8 || !TUNISIAN_NSN.test(d)) return null
  return d
}

export function isValidTunisianPhone(input: string): boolean {
  return normalizeToTunisianNational8(input) !== null
}

/** Forme affichage / WhatsApp : +216XXXXXXXX */
export function tunisianPhoneToE164(input: string): string | null {
  const nsn = normalizeToTunisianNational8(input)
  if (!nsn) return null
  return `+216${nsn}`
}
