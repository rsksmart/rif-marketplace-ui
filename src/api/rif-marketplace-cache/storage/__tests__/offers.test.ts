/* eslint-disable no-underscore-dangle */
import { AbstractAPIService } from 'api/models/apiService'
import OfferFiltersTransport from 'api/models/storage/OfferFiltersTransport'
import { OfferTransport } from 'api/models/storage/transports'
import mockFeathersService from 'api/test-utils/feathers'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageOffer, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { StorageAPIService } from '../interfaces'
import { StorageOffersService } from '../offers'
import { mapOfferFromTransport } from '../utils'

const MOCK_ITEM_0: OfferTransport = {
  utilizedCapacity: '0',
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
      rateId: 'rif',
      tokenAddress: 'FAKE_RIF_ADDRESS',
    },
  ],
}

const MOCK_RESPONSE: OfferTransport[] = [MOCK_ITEM_0]

let offersService: StorageAPIService

describe('Storage OffersService', () => {
  beforeEach(() => {
    offersService = new StorageOffersService()
    offersService.errorReporter = jest.fn()
  })

  test('should be an instance of AbstractAPIService', () => {
    expect(offersService).toBeInstanceOf(AbstractAPIService)
  })

  describe('path', () => {
    test('should be a string', () => {
      expect(offersService.path).toBeTruthy()
      expect(typeof offersService.path).toBe('string')
    })
  })

  describe('_channel', () => {
    test('should be a string', () => {
      expect(offersService._channel).toBeTruthy()
      expect(typeof offersService._channel).toBe('string')
    })
  })

  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      offersService.service = mockFeathersService(MOCK_RESPONSE)
    })

    test('should call find with filters', async () => {
      const serviceFindSpy = jest.spyOn(offersService.service, 'find')
      const filters: StorageOffersFilters = {
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
      const expectedQuery = new OfferFiltersTransport(filters)

      await offersService.fetch(filters)
      expect(serviceFindSpy).toBeCalledWith({ query: expectedQuery })
    })

    test('should return StorageOffer[] on success', async () => {
      const actualOffers: StorageOffer[] = await offersService.fetch({})

      const expectedOffers: StorageOffer[] = MOCK_RESPONSE
        .map(mapOfferFromTransport)

      expect(actualOffers).toStrictEqual(expectedOffers)
    })
  })
})
