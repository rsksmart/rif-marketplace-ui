/* eslint-disable no-underscore-dangle */
import { AbstractAPIService } from 'api/models/apiService'
import AgreementFiltersTransport from 'api/models/storage/AgreementFiltersTransport'
import { AgreementTransport } from 'api/models/storage/transports'
import mockFeathersService from 'api/test-utils/feathers'
import { rifTokenAddress } from 'contracts/config'
import { Agreement } from 'models/marketItems/StorageItem'
import { StorageAgreementService } from '../agreements'
import { AgreementFilters, StorageAPIService } from '../interfaces'
import { mapAgreementFromTransport } from '../utils'

const MOCK_ITEM_0: AgreementTransport = {
  agreementReference: 'mock_agreementReference',
  availableFunds: '10000',
  billingPeriod: 24 * 3600,
  billingPrice: '1000',
  consumer: 'mock_consumer',
  dataReference: 'mock_data_ref',
  expiresIn: '2',
  hasSufficientFunds: true,
  isActive: true,
  lastPayout: new Date(),
  numberOfPrepaidPeriods: 2,
  offerId: 'mock_offer_id',
  periodsSinceLastPayout: 24 * 3600,
  size: '2',
  toBePayedOut: '10',
  tokenAddress: rifTokenAddress,
}

const MOCK_RESPONSE: AgreementTransport[] = [MOCK_ITEM_0]

let agreementService: StorageAPIService

describe('Storage AgreementService', () => {
  beforeEach(() => {
    agreementService = new StorageAgreementService()
    agreementService.errorReporter = jest.fn()
  })

  test('should be an instance of AbstractAPIService', () => {
    expect(agreementService).toBeInstanceOf(AbstractAPIService)
  })

  describe('path', () => {
    test('should be a string', () => {
      expect(agreementService.path).toBeTruthy()
      expect(typeof agreementService.path).toBe('string')
    })
  })

  describe('_channel', () => {
    test('should be a string', () => {
      expect(agreementService._channel).toBeTruthy()
      expect(typeof agreementService._channel).toBe('string')
    })
  })

  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      agreementService.service = mockFeathersService(MOCK_RESPONSE)
    })

    describe('filters', () => {
      let serviceFindSpy: jest.SpyInstance
      beforeEach(() => {
        serviceFindSpy = jest.spyOn(agreementService.service, 'find')
      })

      test('should call find with consumer filter', async () => {
        const consumerFilter: AgreementFilters = {
          consumer: 'mock_consumer',
        }
        const expectedQuery = new AgreementFiltersTransport(consumerFilter)

        await agreementService.fetch(consumerFilter)
        expect(serviceFindSpy).toBeCalledWith({ query: expectedQuery })
      })

      test('should call find with provider filter', async () => {
        const providerFilter: AgreementFilters = {
          provider: 'mock_provider',
        }
        const expectedQuery = new AgreementFiltersTransport(providerFilter)

        await agreementService.fetch(providerFilter)
        expect(serviceFindSpy).toBeCalledWith({ query: expectedQuery })
      })
    })

    test('should return Agreement[] on success', async () => {
      const expectedAgreement: Agreement[] = MOCK_RESPONSE.map(mapAgreementFromTransport)
      const actualReturnValue = await agreementService.fetch({})

      expect(actualReturnValue).toStrictEqual(expectedAgreement)
    })
  })
})
