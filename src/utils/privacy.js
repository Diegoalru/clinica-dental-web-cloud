/** Oculta el usuario de un correo para listados: "ana.solis@correo.com" → "a•••@correo.com". */
export function maskEmail(email) {
  if (!email || !email.includes('@')) return '—'
  const [user, domain] = email.split('@')
  return `${user.charAt(0)}•••@${domain}`
}
