import CID from 'cids'

export const isEmpty = (
  text: string | unknown,
): boolean => !text || !String(text).trim()

export const validateCID = (
  cid: string,
  errorHandle?: (e: Error) => unknown,
): boolean => {
  try {
    CID.validateCID(new CID(cid))

    return true
  } catch (e) {
    if (errorHandle) {
      errorHandle(e)
    }
    return false
  }
}

export const getURLParamByName = (
  url: string, param: string,
): string | undefined => {
  const rgx = `^(?:\\?*${param}=)(\\w*)`
  const match = url.match(rgx)
  return match?.find((_, i) => i === 1)
}
