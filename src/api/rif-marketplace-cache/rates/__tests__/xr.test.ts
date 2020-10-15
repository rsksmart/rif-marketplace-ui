import { AbstractAPIService } from 'api/models/apiService'
import { XRService, xrServiceAddress, XRItem } from 'api/rif-marketplace-cache/rates/xr'

const testFiatSymbol = 'usd'
const testFilter = { fiatSymbol: testFiatSymbol }
const expectedFindOptions = {
  query: {
    $select: ['token', testFiatSymbol],
  },
}
const expectedXRItem: XRItem = {
  [testFiatSymbol]: 0.01,
}

const mockFeathersService = {
  find: jest.fn(() => Promise.resolve([expectedXRItem])),
} as any

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
      xrService.service = mockFeathersService
    })

    test(`should call service.find with ${JSON.stringify(expectedFindOptions)}`, () => {
      const fetchSpy = jest.spyOn(xrService.service, 'find')
      xrService.fetch(testFilter)

      expect(fetchSpy).toBeCalledWith(expectedFindOptions)
    })
    test('should return XRItem[] on success', async () => {
      const actualItem = await xrService.fetch(testFilter)

      expect(actualItem).toEqual([expectedXRItem])
    })
  })
})
