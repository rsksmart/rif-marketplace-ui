export const mayBePluralize = (count, noun, suffix = 's'): string => `${count} ${noun}${count !== 1 ? suffix : ''}`

export default {
  mayBePluralize,
}
