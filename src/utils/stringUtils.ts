export const isEmpty = (
  text: string | unknown,
): boolean => !text || !String(text).trim()

// FIXME: Remove if not used (?)
export const mayBePluralize = (count, noun, suffix = 's'): string => `${count} ${noun}${count !== 1 ? suffix : ''}`
