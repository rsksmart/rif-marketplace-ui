import { MarketCryptoRecord } from 'models/Market'
import { NotifierPlan } from 'models/marketItems/NotifierItem'
import { toFiatPrecision } from 'utils/priceUtils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mapPlansToOffers(
  plans: NotifierPlan[], crypto: MarketCryptoRecord,
) {
  const channelsSet = new Set()
  const currencyOptions = new Set()
  const notificationLimits: number[] = []
  const planPrices: number[] = []

  for (const plan of plans) {
    plan.channels.forEach((channel) => channelsSet.add(channel))
    plan.priceOptions.forEach(({ token, value }) => {
      currencyOptions.add(token.displayName)

      const xrRate = crypto[token.symbol]?.rate || 0
      planPrices.push(value.mul(xrRate).toNumber())
    })
    notificationLimits.push(plan.limit)
  }

  const minPrice = toFiatPrecision(Math.min(...planPrices))
  const maxPrice = toFiatPrecision(Math.max(...planPrices))

  const priceFiatRange = minPrice === maxPrice
    ? `${minPrice}`
    : `${minPrice} - ${maxPrice}`

  const minNotif = Math.min(...notificationLimits)
  const maxNotif = Math.max(...notificationLimits)

  const notifLimitRange = minNotif === maxNotif
    ? `${minNotif}`
    : `${minNotif} - ${maxNotif}`

  return {
    channels: Array.from(channelsSet).join(', '),
    currencies: Array.from(currencyOptions).join(', '),
    notifLimitRange,
    priceFiatRange,
  }
}

export default {}
