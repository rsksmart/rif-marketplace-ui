import { DomainTransport } from 'api/models/transports'
import { RnsDomain } from 'models/marketItems/DomainItem'
import mockFeathersService from 'api/test-utils/feathers'
import { DomainsService } from '../domains'
import { RnsAPIService } from '../common'

const mockOwnerAddress = 'fake_owner_address'
const expectedFindOptions = {
  query: {
    ownerAddress: mockOwnerAddress,
  },
}
const MOCK_DATE = 'Wed Jul 29 2020 18:32:24 GMT+0100 (British Summer Time)'
const MOCK_DOMAIN_TRANSPORT_ITEM_0: DomainTransport = {
  expiration: { date: MOCK_DATE },
  name: 'mock_name',
  owner: {
    address: 'mock_owner',
  },
  tokenId: 'rbtc',
}
const MOCK_DOMAIN_TRANSPORT_ITEM_1: DomainTransport = {
  expiration: { date: MOCK_DATE },
  name: 'mock_name_1',
  owner: {
    address: 'mock_owner_1',
  },
  tokenId: 'rbtc',
}

const MOCK_TRANSPORT = [MOCK_DOMAIN_TRANSPORT_ITEM_0, MOCK_DOMAIN_TRANSPORT_ITEM_1]

const MOCK_FILTER = { price: { max: 2, min: 2 }, ownerAddress: 'mock_owner_address' }

const expectedDomain1 = {
  expirationDate: new Date(MOCK_DOMAIN_TRANSPORT_ITEM_0.expiration.date),
  id: MOCK_DOMAIN_TRANSPORT_ITEM_0.tokenId,
  name: MOCK_DOMAIN_TRANSPORT_ITEM_0.name,
  ownerAddress: MOCK_DOMAIN_TRANSPORT_ITEM_0.owner.address,
  tokenId: MOCK_DOMAIN_TRANSPORT_ITEM_0.tokenId,
}
const expectedDomain2 = {
  expirationDate: new Date(MOCK_DOMAIN_TRANSPORT_ITEM_1.expiration.date),
  id: MOCK_DOMAIN_TRANSPORT_ITEM_1.tokenId,
  name: MOCK_DOMAIN_TRANSPORT_ITEM_1.name,
  ownerAddress: MOCK_DOMAIN_TRANSPORT_ITEM_1.owner.address,
  tokenId: MOCK_DOMAIN_TRANSPORT_ITEM_1.tokenId,
}

const expectedFindQuery = {
  query: {
    placed: false,
    name: undefined,
    ownerAddress: MOCK_FILTER.ownerAddress,
  },
}

let domainsAPI: RnsAPIService
describe('DomainsService', () => {
  beforeEach(() => {
    domainsAPI = new DomainsService()
  })
  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      domainsAPI.service = mockFeathersService(MOCK_TRANSPORT)
    })
    test('should call service.find once', () => {
      const findSpy = jest.spyOn(domainsAPI.service, 'find')
      domainsAPI.fetch(MOCK_FILTER)

      expect(findSpy).toBeCalledTimes(1)
    })
    test(`should call service.find with ${JSON.stringify(expectedFindOptions)}`, () => {
      const findSpy = jest.spyOn(domainsAPI.service, 'find')
      domainsAPI.fetch(MOCK_FILTER)

      expect(findSpy).toBeCalledWith(expectedFindQuery)
    })

    test('should return RnsDomain[] on success', async () => {
      const actualReturn: RnsDomain[] = await domainsAPI.fetch(MOCK_FILTER) as RnsDomain[]
      expect(actualReturn[0]).toEqual(expectedDomain1)
      expect(actualReturn[1]).toEqual(expectedDomain2)
    })
  })
})
