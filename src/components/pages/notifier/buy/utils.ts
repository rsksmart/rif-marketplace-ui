import Big from 'big.js'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierPlan } from 'models/marketItems/NotifierItem'

export function mapPlansToOffers(plans: NotifierPlan[], crypto: MarketCryptoRecord) {
  const channelsSet = new Set()
  const currencyOptions = new Set()
  const notificationLimits: number[] = []
  const planPrices: Big[] = []

  for (const plan of plans) {
    plan.channels.forEach((channel) => channelsSet.add(channel))
    plan.priceOptions.forEach(({ token, value }) => {
      currencyOptions.add(SUPPORTED_TOKEN_RECORDS[token].displayName)

      const xrRate = crypto[token].rate
      planPrices.push(value.mul(xrRate))
    })
    notificationLimits.push(plan.limit)
  }
  const sortedLimits = notificationLimits.sort()
  const sortedPrices = planPrices.sort()

  let notifLimitRange = sortedLimits.shift()?.toString() ?? ''
  const limitMax = sortedLimits.pop()
  notifLimitRange += limitMax ? ` - ${limitMax}` : ''

  let priceFiatRange = sortedPrices.shift()?.toString() ?? ''
  const priceMax = sortedPrices.pop()
  priceFiatRange += priceMax ? ` - ${priceMax}` : ''

  return {
    channels: Array.from(channelsSet).join(', '),
    currencies: Array.from(currencyOptions).join(', '),
    notifLimitRange,
    priceFiatRange,
  }
}

export default {}
