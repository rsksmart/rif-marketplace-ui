export const mayBePluralize = (count, noun, suffix = 's'): string => `${count} ${noun}${count !== 1 ? suffix : ''}`

export const criptoDisplayPrice = (
  value: number,
  maxDecimals = 8,
): string => value
  .toFixed(maxDecimals)
  .toString()
  .replace(/[.,]00000000$/, '')

export default {
  mayBePluralize,
}
