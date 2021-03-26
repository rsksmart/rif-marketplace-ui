import { MarketCryptoRecord } from 'models/Market'
import { NotifierPlan } from 'models/marketItems/NotifierItem'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mapPlansToOffers(
  {
    channels,
    priceOptions,
    limit,
  }: NotifierPlan,
  crypto: MarketCryptoRecord,
) {
  const channelsSet = new Set(channels)
  const currencyOptions = new Set()
  const planPrices = priceOptions.map(({ token, value }) => {
    currencyOptions.add(token.displayName)

    const xrRate = crypto[token.symbol].rate
    return value.mul(xrRate).toNumber()
  })

  const minPrice = Math.min(...planPrices)
  const maxPrice = Math.max(...planPrices)

  const priceFiatRange = minPrice === maxPrice
    ? `${minPrice}`
    : `${minPrice}-${maxPrice}`

  return {
    channels: Array.from(channelsSet).join(', '),
    currencies: Array.from(currencyOptions).join(', '),
    notifLimitRange: limit,
    priceFiatRange,
  }
}

export default {}
