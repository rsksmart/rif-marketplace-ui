import { AbstractAPIService } from 'api/models/apiService'
import { XRService, xrServiceAddress, XRItem } from 'api/rif-marketplace-cache/rates/xr'
import mockFeathersService from 'api/test-utils/feathers'
import { SYSTEM_SUPPORTED_SYMBOL } from 'models/Token'

const TEST_FIAT_SYMBOL = 'usd'
const TEST_Q_FILTER = { fiatSymbol: TEST_FIAT_SYMBOL }
const TEST_TOKEN = SYSTEM_SUPPORTED_SYMBOL.rbtc
const expectedFindOptions = {
  query: {
    $select: ['token', TEST_FIAT_SYMBOL],
  },
}
const expectedXRItem: XRItem = {
  [TEST_FIAT_SYMBOL]: 0.01,
  token: TEST_TOKEN,
}

const fakeErrorHandler = jest.fn()

describe('Exchange rate service', () => {
  let xrService: XRService

  beforeEach(() => {
    xrService = new XRService()
  })

  test('should be an instance of AbstractAPIService', () => {
    expect(xrService instanceof AbstractAPIService).toBeTruthy()
  })

  describe('connect', () => {
    test(`should return path '${xrServiceAddress}'`, () => {
      const path = xrService.connect(fakeErrorHandler)

      expect(path).toBe(xrServiceAddress)
    })
    test('should create a feathersjs service', () => {
      xrService.connect(fakeErrorHandler)
      const { service } = xrService

      expect(service).toBeTruthy()
    })
  })

  describe('_fetch called via super.fetch', () => {
    beforeEach(() => {
      xrService.service = mockFeathersService([expectedXRItem])
    })
    test(`should call service.find with ${JSON.stringify(expectedFindOptions)}`, async () => {
      const fetchSpy = jest.spyOn(xrService.service, 'find')
      await xrService.fetch(TEST_Q_FILTER)

      expect(fetchSpy).toBeCalledWith(expectedFindOptions)
    })
    test('should return XRItem[] on success', async () => {
      const actualItem = await xrService.fetch(TEST_Q_FILTER)

      expect(actualItem).toEqual([expectedXRItem])
    })
  })
})
