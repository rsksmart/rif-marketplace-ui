import { AbstractAPIService } from 'api/models/apiService'
import mockFeathersService from 'api/test-utils/feathers'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { NotifierSubscriptionsService } from '../..'
import { mapFromTransport } from '../api'
import SubscriptionsService, { notifierSubscriptionsAddress, NotifierSubscriptionsTransportModel, notifierSubscriptionsWSChannel } from '../index'

const MOCK_ITEM_0: NotifierSubscriptionsTransportModel = {
  providerId: 'TEST_PROVIDER_ADDR',
  consumer: 'TEST_CONSUMER_ADDR',
  hash: 'TEST_HASH',
  expirationDate: new Date(),
  previousSubscription: 'IS THIS ADDRESS OR SHOULD IT BE TYPE NUMNER AS IN SUBSCRIPTION_ID?',
  status: 'ACTIVE',
  subscriptionId: 1,
  plan: {
    planId: 1,
    channels: [{ id: 1, name: 'API' }],
    daysLeft: 100,
    name: '1k',
    planStatus: 'ACTIVE',
    prices: [
      {
        id: 1,
        price: '2',
        rateId: 'rif',
        rate: 1,
      },
    ],
    providerId: '0xTEST',
    quantity: 10,
    url: 'nada',
  },
  topics: [
    {
      notificationPreferences: 'API',
      topicParams: [],
      type: 'NEW_BLOCK',
    },
  ],
  notificationBalance: 2,
  paid: false,
  price: '2'.padEnd(18, '0'),
  rateId: 'rif',
  provider: {
    provider: 'TEST_PROVIDER_ADDR',
    url: 'nada',
  },
}

const MOCK_RESPONSE: NotifierSubscriptionsTransportModel[] = [MOCK_ITEM_0]

let subscriptionsService: NotifierSubscriptionsService

describe('Notifier Subscriptions Service', () => {
  beforeEach(() => {
    subscriptionsService = new SubscriptionsService()
  })

  describe('notifierSubscriptionsAddress', () => {
    const expectedAddress = 'notifier/v0/subscriptions'
    test(`should be set to ${expectedAddress}`, () => {
      expect(notifierSubscriptionsAddress).toBe(expectedAddress)
    })
  })

  describe('notifierSubscriptionsWSChannel', () => {
    const expectedAddress = 'notifier_subscriptions'
    test(`should be set to ${expectedAddress}`, () => {
      expect(notifierSubscriptionsWSChannel).toBe(expectedAddress)
    })
  })

  test('should be an instance of AbstractAPIService', () => {
    expect(subscriptionsService).toBeInstanceOf(AbstractAPIService)
  })

  describe('path', () => {
    test(`should be set to ${notifierSubscriptionsAddress}`, () => {
      expect(subscriptionsService.path).toBe(notifierSubscriptionsAddress)
    })
  })

  describe('_channel', () => {
    test(`should be set to ${notifierSubscriptionsWSChannel}`, () => {
      expect(subscriptionsService._channel).toBe(notifierSubscriptionsWSChannel)
    })
  })

  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      subscriptionsService.service = mockFeathersService(MOCK_RESPONSE)
    })

    test('should call service find method', async () => {
      const serviceFindSpy = jest.spyOn(subscriptionsService.service, 'find')

      await subscriptionsService.fetch()
      expect(serviceFindSpy).toBeCalled()
    })

    test('should return NotifierSubscriptionItem[] on success', async () => {
      const actualSubscriptions: NotifierSubscriptionItem[] = await subscriptionsService.fetch()

      const expectedSubscriptions: NotifierSubscriptionItem[] = MOCK_RESPONSE
        .map(mapFromTransport)

      expect(actualSubscriptions).toStrictEqual(expectedSubscriptions)
    })
  })
})
