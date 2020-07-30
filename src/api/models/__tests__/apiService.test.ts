import { AbstractAPIService } from 'api/models/apiService';

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
        beforeEach(() => {

        })
        test('should call its abstract function _fetch if its service exists', () => {
            fakeApiService.connect(fakeErrorReporter)
            fakeApiService._fetch = jest.fn()
            fakeApiService.fetch()
            expect(fakeApiService._fetch).toBeCalled()
        })
        test('should call errorReporter if service is falsy', () => {

            fakeApiService.fetch()
            expect(fakeErrorReporter).toBeCalled()
        })
        test('should call errorReporter if this._fetch fails', () => {
            fakeApiService.connect(fakeErrorReporter)
            fakeApiService._fetch = () => { return Promise.reject('fake reject') }

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