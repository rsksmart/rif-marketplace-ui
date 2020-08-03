import { AbstractAPIService } from 'api/models/apiService'

const MOCK_PATH = 'fake_path'

describe('AbstractAPIService', () => {
  const fakeErrorReporter = jest.fn()

  class FakeAPIService extends AbstractAPIService {
    path = MOCK_PATH

    _fetch!: (filters?: any) => Promise<any>
  }

  let fakeApiService: FakeAPIService
  beforeEach(() => {
    fakeApiService = new FakeAPIService()
  })
  describe('connect', () => {
    test('should create new service in this.service', () => {
      expect(fakeApiService.service).toBeFalsy()
      fakeApiService.connect(fakeErrorReporter)

      expect(fakeApiService.service).toBeTruthy()
    })
    test('should return path from the concrete class', () => {
      const expectedPath = MOCK_PATH
      const actualPath = fakeApiService.connect(fakeErrorReporter)

      expect(actualPath).toBe(expectedPath)
    })
  })

  describe('fetch', () => {
    test('should call its abstract function _fetch if its service exists', () => {
      fakeApiService.connect(fakeErrorReporter)
      fakeApiService._fetch = jest.fn() // eslint-disable-line no-underscore-dangle
      fakeApiService.fetch()
      expect(fakeApiService._fetch).toBeCalled() // eslint-disable-line no-underscore-dangle
    })
    test('should call errorReporter if service is falsy', () => {
      fakeApiService.connect(fakeErrorReporter)
      fakeApiService.service = undefined as any
      fakeApiService.fetch()
      expect(fakeErrorReporter).toBeCalled()
    })
    test('should call errorReporter if this._fetch fails', () => {
      fakeApiService.connect(fakeErrorReporter)
      fakeApiService._fetch = () => Promise.reject(new Error('fake reject')) // eslint-disable-line no-underscore-dangle

      fakeApiService.fetch()
      expect(fakeErrorReporter).toBeCalled()
    })
  })

  describe('authenticate', () => {
    beforeEach(() => {
      fakeApiService.connect(fakeErrorReporter)
    })

    test.todo('returns authentication result on success')
  })
})
