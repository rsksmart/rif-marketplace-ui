import { AbstractAPIService } from 'api/models/apiService'
import { Confirmations, ConfirmationsService, ConfirmationsTransportItem } from '../confirmations'
import utils from '../utils'

const MOCK_CONFIRMATION_0: ConfirmationsTransportItem = {
  transactionHash: 'mock_transaction_hash',
  targetConfirmation: 2,
  confirmations: 0,
  event: 'mock_transaction_event',
}

const expectedConfirmations: Confirmations = {
  [MOCK_CONFIRMATION_0.transactionHash]: {
    currentCount: MOCK_CONFIRMATION_0.confirmations,
    targetCount: MOCK_CONFIRMATION_0.targetConfirmation,
  },
}

const mockFeathersService = {
  find: jest.fn(() => Promise.resolve([MOCK_CONFIRMATION_0])),
} as any

const fakeErrorHandler = jest.fn()

describe('Confirmations service', () => {
  let confirmationService: ConfirmationsService

  beforeEach(() => {
    confirmationService = new ConfirmationsService()
  })

  test('should be an instance of AbstractAPIService', () => {
    expect(confirmationService instanceof AbstractAPIService).toBeTruthy()
  })

  describe('connect', () => {
    test('should return the "confirmations" path', () => {
      const path = confirmationService.connect(fakeErrorHandler)

      expect(path).toBe('confirmations')
    })
    test('should create a feathersjs service', () => {
      confirmationService.connect(fakeErrorHandler)
      const { service } = confirmationService

      expect(service).toBeTruthy()
    })
  })

  describe('_fetch called via super.fetch', () => {
    beforeEach(() => {
      confirmationService.service = mockFeathersService
    })
    test('should call service.find with no arguments', () => {
      const fetchSpy = jest.spyOn(confirmationService.service, 'find')
      confirmationService.fetch('unwanted_arg')

      expect(fetchSpy).toBeCalledWith()
    })
    test('should call mapFromTransport', async () => {
      const mapFromTransportSpy = jest.spyOn(utils, 'mapFromTransport')
      await confirmationService.fetch()

      expect(mapFromTransportSpy).toBeCalledTimes(1)
    })
    test('should call mapFromTransport with array arg', async () => {
      const mapFromTransportSpy = jest.spyOn(utils, 'mapFromTransport')
      await confirmationService.fetch()

      expect(mapFromTransportSpy).toBeCalledWith([MOCK_CONFIRMATION_0])
    })

    test('should return Confirmations on success', async () => {
      const actualItem = await confirmationService.fetch()

      expect(actualItem).toEqual(expectedConfirmations)
    })
  })
})
