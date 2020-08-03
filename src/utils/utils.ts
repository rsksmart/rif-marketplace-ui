export const mayBePluralize = (count, noun, suffix = 's'): string => `${count} ${noun}${count !== 1 ? suffix : ''}`

export const priceDisplay = (value: number, maxDecimals = 8): string => value
  .toFixed(maxDecimals)
  .toString()
  .replace(/[.,]00000000$/, '')

export const convertGbsToBytes = (gbs: number): number => gbs * 1024 * 1024 * 1024

export const convertBytesToGbs = (bytes: number): number => bytes / 1024 / 1024 / 1024

export const convertDaysToSeconds = (days: number): number => days * 24 * 60 * 60

export default {
  mayBePluralize,
}
