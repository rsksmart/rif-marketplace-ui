export const mayBePluralize = (count, noun, suffix = 's'): string => `${count} ${noun}${count !== 1 ? suffix : ''}`

export const priceDisplay = (value: number, maxDecimals = 8): string => value
  .toFixed(maxDecimals)
  .toString()
  .replace(/[.,]00000000$/, '')

export const convertGbsToBytes = (gbs: number): number => gbs * 1024 ** 3

export const convertBytesToGbs = (bytes: number): number => bytes / convertBytesToGbs(1)

export const convertDaysToSeconds = (days: number): number => days * 24 * 60 * 60

export default {
  mayBePluralize,
}

export const getTabValueFromLocation = (tabs: { label: string, to: string, value: string }[], defaultRoute: string) => (currentPath: string) => {
  const activeTab = tabs.find((tab) => currentPath.includes(tab.to))
  return activeTab?.to || defaultRoute
}
