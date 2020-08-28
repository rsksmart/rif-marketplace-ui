import { AbstractAPIService } from 'api/models/apiService'
import {
  StorageItem, StorageOffer, BillingPlan, PeriodInSeconds,
} from 'models/marketItems/StorageItem'
import { OfferTransport } from 'api/models/storage/transports'
import { Big } from 'big.js'
import { parseToBigDecimal } from 'utils/parsers'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'

export const offersAddress: StorageServiceAddress = 'storage/v0/offers'
export const offersWSChannel: StorageWSChannel = 'offers'

const mapFromTransport = (offerTransport: OfferTransport): StorageOffer => {
  const {
    provider,
    availableCapacity,
    plans,
  } = offerTransport

  const offer: StorageOffer = {
    id: provider,
    location: 'UK',
    system: 'IPFS',
    availableSize: new Big(availableCapacity),
    subscriptionOptions: plans
      .filter((plan) => !!PeriodInSeconds[plan.period])
      .map<BillingPlan>((plan) => ({
        period: PeriodInSeconds[plan.period],
        price: parseToBigDecimal(plan.price, 18),
        currency: 'RBTC',
      })),
    pricePGBPDay: plans
      .reduce<Big>((acc, plan) => {
        const period = new Big(plan.period)
        const price = parseToBigDecimal(plan.price, 18)
        const combinedPrice = acc.add(price.div(period))
        return combinedPrice
      }, new Big(0))
      .div(plans.length)
      .mul(new Big(PeriodInSeconds.Daily)),
  }
  return offer
}

export class StorageOffersService extends AbstractAPIService implements StorageAPIService {
  path = offersAddress

  _channel = offersWSChannel

  _fetch = async (): Promise<StorageItem[]> => {
    const result = await this.service.find()

    return result.map(mapFromTransport)
  }
}
