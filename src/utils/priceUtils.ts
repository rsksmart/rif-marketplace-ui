import Big, { BigSource } from 'big.js'
import { TokenXR } from 'models/Market'

export const PRICE_PRECISIONS = {
  FIAT: 3,
  CRYPTO: 8,
} as const

export const squashTrailingZeroes = (text: string): string => text.replace(/0+$/, '0')

export const toPrecision = (
  price: BigSource,
  precisionType: keyof typeof PRICE_PRECISIONS,
): string => {
  const precision = PRICE_PRECISIONS[precisionType]

  const bigPrice = Big(price)
  const exponent = bigPrice.e

  const fixTo = bigPrice.lt(1) && exponent > precision ? exponent : precision

  return squashTrailingZeroes(bigPrice.toFixed(fixTo))
}

export const toFiatPrecision = (price: BigSource): string => toPrecision(price, 'FIAT')
export const toCryptoPrecision = (price: BigSource): string => toPrecision(price, 'CRYPTO')

export const getFiatPrice = (
  price: Big,
  token?: TokenXR,
): string => toFiatPrecision(price.mul(token?.rate || 0))

export const getCryptoPrice = (
  price: BigSource,
  token?: TokenXR,
): string => toCryptoPrecision(Big(price).div(token?.rate || 1))
