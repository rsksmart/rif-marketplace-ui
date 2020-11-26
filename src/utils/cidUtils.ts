import CID from 'cids'

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

export default {}
