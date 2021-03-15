import Big from 'big.js'
import { AbstractAPIService } from 'api/models/apiService'
import mockFeathersService from 'api/test-utils/feathers'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { SYSTEM_SUPPORTED_SYMBOL } from 'models/Token'
import OffersService, { notifierOffersAddress, NotifierOffersTransportModel, notifierOffersWSChannel } from '../index'
import { NotifierAPIService } from '../../interfaces'
import TransportModel from '../models'

const MOCK_ITEM_0: NotifierOffersTransportModel = new TransportModel({
  provider: 'TEST_ID',
  plans: [
    {
      channels: ['test_ch0'],
      expirationDate: new Date(),
      id: 'test_plan_id',
      limit: 200,
      priceOptions: [
        {
          token: SYSTEM_SUPPORTED_SYMBOL.rif,
          value: Big(0.1),
        },
      ],
    },
  ],
})

const MOCK_RESPONSE: NotifierOffersTransportModel[] = [MOCK_ITEM_0]

let offersService: NotifierAPIService

describe('Notifier Offers Service', () => {
  beforeEach(() => {
    offersService = new OffersService()
  })

  describe('notifierOffersAddress', () => {
    const expectedAddress = 'triggers/v0/providers'
    test(`should be set to ${expectedAddress}`, () => {
      expect(notifierOffersAddress).toBe(expectedAddress)
    })
  })

  describe('notifierOffersWSChannel', () => {
    const expectedAddress = 'offers'
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

      await offersService.fetch()
      expect(serviceFindSpy).toBeCalled()
    })

    test('should return NotifierOfferItem[] on success', async () => {
      const actualOffers: NotifierOfferItem[] = await offersService.fetch()

      const expectedOffers: NotifierOfferItem[] = MOCK_RESPONSE
        .map(({ toLocal }) => toLocal)

      expect(actualOffers).toStrictEqual(expectedOffers)
    })
  })
})
