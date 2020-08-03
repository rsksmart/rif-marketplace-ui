import { SoldDomainTransport } from 'api/models/transports'
import mockFeathersService from 'api/test-utils/feathers'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { RnsAPIService, availableTokens } from '../common'
import { SoldDomainsService } from '../sold'

const mockOwnerAddress = 'fake_owner_address'
const expectedFindOptions = {
  query: {
    ownerAddress: mockOwnerAddress,
  },
}

const MOCK_DOMAIN_TRANSPORT_ITEM_0: SoldDomainTransport = {
  domain: {
    expiration: {
      date: 'Wed Jul 29 2021',
    },
    name: 'fake_name',
    owner: {
      address: 'fake_addr',
    },
    tokenId: 'fake_token_id',
  },
  id: 'fake_id',
  paymentToken: 'rif',
  priceString: '900000',
  soldDate: 'Wed Jul 30 2020',
  tokenId: 'fake_token_id',
  transfer: {
    buyerAddress: 'fake_addr',
    sellerAddress: 'fake_addr',
  },
}

const MOCK_TRANSPORT = [MOCK_DOMAIN_TRANSPORT_ITEM_0]

const MOCK_FILTER = { price: { max: 2, min: 2 }, ownerAddress: 'mock_owner_address' }

const expectedDomains: RnsSoldDomain[] = [
  {
    buyer: MOCK_DOMAIN_TRANSPORT_ITEM_0.transfer.buyerAddress,
    domainName: MOCK_DOMAIN_TRANSPORT_ITEM_0.domain.name,
    id: MOCK_DOMAIN_TRANSPORT_ITEM_0.id,
    paymentToken: availableTokens[MOCK_DOMAIN_TRANSPORT_ITEM_0.paymentToken.toLowerCase()],
    price: parseToBigDecimal(MOCK_DOMAIN_TRANSPORT_ITEM_0.priceString, 18),
    soldDate: new Date(MOCK_DOMAIN_TRANSPORT_ITEM_0.soldDate),
    tokenId: MOCK_DOMAIN_TRANSPORT_ITEM_0.tokenId,
  },
]

const expectedFindQuery = {
  query: {
    domain: undefined,
    ownerAddress: MOCK_FILTER.ownerAddress,
  },
}

let soldDomainsAPI: RnsAPIService
describe('DomainsService', () => {
  beforeEach(() => {
    soldDomainsAPI = new SoldDomainsService()
  })
  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      soldDomainsAPI.service = mockFeathersService(MOCK_TRANSPORT)
    })
    test('should call service.find once', () => {
      const findSpy = jest.spyOn(soldDomainsAPI.service, 'find')
      soldDomainsAPI.fetch(MOCK_FILTER)

      expect(findSpy).toBeCalledTimes(1)
    })
    test(`should call service.find with ${JSON.stringify(expectedFindOptions)}`, () => {
      const findSpy = jest.spyOn(soldDomainsAPI.service, 'find')
      soldDomainsAPI.fetch(MOCK_FILTER)

      expect(findSpy).toBeCalledWith(expectedFindQuery)
    })

    test('should return RnsSoldDomain[] on success', async () => {
      const actualReturn = await soldDomainsAPI.fetch(MOCK_FILTER)
      expect(actualReturn).toContainEqual(expectedDomains[0])
    })
  })
})

export { }
