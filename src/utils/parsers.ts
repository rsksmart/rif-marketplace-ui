import { Big, BigSource } from 'big.js'

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
): string => parseInt(parseToBigDecimal(src, -18).toString(), 10).toString()
