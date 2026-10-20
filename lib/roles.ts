export type Role = 'owner' | 'parent'

export function destinationForRole(role?: string | null) {
  return role === 'owner' ? '/dashboard' : '/account'
}
