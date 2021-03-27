export const setBrowserSessionCannotRenew = (
  hash: string,
): void => sessionStorage.setItem(hash, String(true))

export const getBrowserSessionCanRenew = (
  hash: string,
): boolean => !sessionStorage.getItem(hash)
