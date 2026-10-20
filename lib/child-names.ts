export function childNames(value: unknown) {
  const list = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  const names: string[] = []
  for (const item of list) {
    if (typeof item !== 'string') continue
    const name = item.trim().replace(/\s+/g, ' ')
    if (name.length < 2 || name.length > 80) continue
    if (names.some((existing) => existing.toLowerCase() === name.toLowerCase())) continue
    names.push(name)
    if (names.length === 3) break
  }
  return names
}
