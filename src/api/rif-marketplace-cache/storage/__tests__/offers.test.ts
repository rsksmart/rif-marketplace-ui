import { Big } from 'big.js'
import { OfferTransport } from 'api/models/storage/transports'
import mockFeathersService from 'api/test-utils/feathers'
import {
  StorageOffer,
  BillingPlan,
  PeriodInSeconds,
  SubscriptionPeriod,
} from 'models/marketItems/StorageItem'
import { parseToBigDecimal } from 'utils/parsers'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { StorageOffersService } from '../offers'
import { StorageAPIService } from '../interfaces'

const FAKE_OFFER_0: OfferTransport = {
  utilizedCapacity: '1',
  availableCapacity: '1073741824',
  provider: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
  totalCapacity: '1073741824',
  peerId: 'QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N',
  avgBillingPrice: 5,
  createdAt: '2020-08-10T14:11:32.648Z',
  updatedAt: '2020-08-10T14:11:32.740Z',
  acceptedCurrencies: ['rif'],
  plans: [
    {
      id: 1,
      period: '86400',
      price: '931322574',
      offerId: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      createdAt: '2020-08-10T14:11:32.680Z',
      updatedAt: '2020-08-10T14:11:32.680Z',
    },
  ],
}

const FAKE_TRANSPORT = [FAKE_OFFER_0]

let offersService: StorageAPIService

describe('Storage OffersService', () => {
  beforeEach(() => {
    offersService = new StorageOffersService()
    offersService.errorReporter = jest.fn()
  })

  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      offersService.service = mockFeathersService(FAKE_TRANSPORT)
    })

    test('should return StorageOffer[] on success', async () => {
      const filters: Partial<StorageOffersFilters> = {
        price: {
          min: 4,
          max: 6,
        },
        size: {
          min: 0,
          max: 1000,
        },
        periods: new Set<SubscriptionPeriod>(['Daily']),
      }
      const actualReturnValue: StorageOffer[] = await offersService.fetch(
        filters,
      )
      const {
        provider,
        availableCapacity,
        avgBillingPrice,
        plans,
        acceptedCurrencies,
      } = FAKE_OFFER_0
      const expectedOffers: StorageOffer = {
        id: provider,
        location: 'UK',
        acceptedCurrencies,
        system: 'IPFS',
        availableSizeGB: new Big(availableCapacity).div(UNIT_PREFIX_POW2.KILO),
        subscriptionOptions: plans
          .filter((plan) => !!PeriodInSeconds[plan.period])
          .map<BillingPlan>((plan) => ({
            period: PeriodInSeconds[plan.period],
            price: parseToBigDecimal(plan.price),
            currency: 'rbtc',
          })),
        averagePrice: avgBillingPrice,
        peerId: 'QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N',
      }

      expect(actualReturnValue[0]).toStrictEqual(expectedOffers)
    })
  })
})
