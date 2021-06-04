import { AbstractAPIService } from 'api/models/apiService'
import mockFeathersService from 'api/test-utils/feathers'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { SYSTEM_SUPPORTED_SYMBOL } from 'models/Token'
import { NotifierOffersFilters } from 'models/marketItems/NotifierFilters'
import { SYSTEM_SUPPORTED_FIAT } from 'models/Fiat'
import OffersService, { notifierOffersAddress, NotifierOffersTransportModel, notifierOffersWSChannel } from '../index'
import { mapFromTransport } from '../api'
import { NotifierOffersService } from '../..'

const MOCK_ITEM_0: NotifierOffersTransportModel = {
  providerId: 'TEST_ID',
  url: 'TEST_URL',
  planStatus: 'ACTIVE',
  channels: [
    {
      id: 1,
      name: 'MOCK_CHANNEL',
    },
  ],
  daysLeft: 122,
  id: 1,
  name: 'test_plan_id',
  quantity: 200,
  prices: [
    {
      id: 1,
      rateId: SYSTEM_SUPPORTED_SYMBOL.rif,
      rate: 3,
      price: '0.1',
    },
  ],
}

const MOCK_RESPONSE: NotifierOffersTransportModel[] = [MOCK_ITEM_0]

let offersService: NotifierOffersService

const filters: NotifierOffersFilters = {
  price: {
    min: 1,
    max: 10,
    fiatSymbol: SYSTEM_SUPPORTED_FIAT.usd,
  },
  size: { min: 1, max: 10 },
}

describe('Notifier Offers Service', () => {
  beforeEach(() => {
    offersService = new OffersService()
  })

  describe('notifierOffersAddress', () => {
    const expectedAddress = 'notifier/v0/offers'
    test(`should be set to ${expectedAddress}`, () => {
      expect(notifierOffersAddress).toBe(expectedAddress)
    })
  })

  describe('notifierOffersWSChannel', () => {
    const expectedAddress = 'notifier_offers'
    test(`should be set to ${expectedAddress}`, () => {
      expect(notifierOffersWSChannel).toBe(expectedAddress)
    })
  })

  test('should be an instance of AbstractAPIService', () => {
    expect(offersService).toBeInstanceOf(AbstractAPIService)
  })

  describe('path', () => {
    test(`should be set to ${notifierOffersAddress}`, () => {
      expect(offersService.path).toBe(notifierOffersAddress)
    })
  })

  describe('_channel', () => {
    test(`should be set to ${notifierOffersWSChannel}`, () => {
      expect(offersService._channel).toBe(notifierOffersWSChannel)
    })
  })

  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      offersService.service = mockFeathersService(MOCK_RESPONSE)
    })

    test('should call service find method', async () => {
      const serviceFindSpy = jest.spyOn(offersService.service, 'find')

      await offersService.fetch(filters)
      expect(serviceFindSpy).toBeCalled()
    })

    test('should return NotifierOfferItem[] on success', async () => {
      const actualOffers: NotifierOfferItem[] = await offersService.fetch(filters)

      const expectedOffers: NotifierOfferItem[] = MOCK_RESPONSE
        .map(mapFromTransport)

      expect(actualOffers).toStrictEqual(expectedOffers)
    })
  })
})
