import { Big, BigSource } from 'big.js'

export const parseToBigDecimal = (
  src: BigSource,
  decimalPlaces: number,
): Big => {
  const big = new Big(src)
  return big.div(10 ** decimalPlaces)
}

export const parseToInt = (src: string, decimalPlaces: number): number => parseInt(src, 10) / 10 ** decimalPlaces

export const convertToBigString = (
  src: number,
  decimalPlaces: number,
): string => {
  const big = new Big(src)
  return big.times(10 ** decimalPlaces).toString()
}

// parses to wei ignoring the decimals
export const parseToWei = (src: BigSource): string => {
  const weiString = parseToBigDecimal(src, -18).toString()

  return weiString.split('.')[0]
}
