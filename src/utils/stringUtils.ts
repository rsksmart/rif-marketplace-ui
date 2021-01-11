import { shortenString } from '@rsksmart/rif-ui'
import { networkId } from 'config'
import { toChecksumAddress } from '@rsksmart/rsk-utils'

export const getURLParamByName = (
  url: string, param: string,
): string | undefined => {
  const rgx = `^(?:\\?*${param}=)(\\w*)`
  const match = url.match(rgx)
  return match?.find((_, i) => i === 1)
}

export const isEmpty = (
  text: string | unknown,
): boolean => !(text && String(text).trim())

export const shortChecksumAddress = (address: string): string => shortenString(
  toChecksumAddress(address, networkId),
)
