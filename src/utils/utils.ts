// TODO: move to RIF-UI library
export const mayBePluralize = (count, noun, suffix = 's'): string => `${count} ${noun}${count !== 1 ? suffix : ''}`
