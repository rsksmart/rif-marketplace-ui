import { Big, BigSource } from 'big.js'
import { UNIT_PREFIX_POW2 } from './utils'

export const parseToBigDecimal = (
  src: BigSource,
  decimalPlaces = 18,
): Big => {
  const big = new Big(src)
  return big.div(10 ** decimalPlaces)
}

export const parseToInt = (
  src: string,
  decimalPlaces: number,
): number => parseFloat(src) / 10 ** decimalPlaces

export const convertToBigString = (
  src: number,
  decimalPlaces: number,
): string => {
  const big = new Big(src)
  return big.times(10 ** decimalPlaces).toString()
}

// parses to wei ignoring the decimals
export const convertToWeiString = (
  src: BigSource,
): string => parseToBigDecimal(src, -18).round(0).toFixed(0)

export const parseConvertBig = (
  source: BigSource, rate: UNIT_PREFIX_POW2,
): Big => new Big(source).div(rate)
