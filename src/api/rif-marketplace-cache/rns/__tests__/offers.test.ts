import { OfferTransport } from 'api/models/transports'
import mockFeathersService from 'api/test-utils/feathers'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { RnsFilter } from 'api/models/RnsFilter'
import { rifTokenAddress } from 'contracts/config'
import { OffersService } from '../offers'
import { rnsTokenAddrTokenRecord } from '../common'

const MOCK_OFFER_0: OfferTransport = {
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
  offerId: 'fake_id',
  paymentToken: rifTokenAddress,
  priceString: '19000000000',
  ownerAddress: 'string',
  ownerDomain: 'string',
  tokenId: 'string',
  txHash: 'mock_hash',
}

const MOCK_TRANSPORT = [MOCK_OFFER_0]
const MOCK_FILTERS: RnsFilter = {
  price: {
    max: 2,
    min: 3,
  },
  status: 'owned',
}

// @ts-ignore
rnsTokenAddrTokenRecord.mockaddress = 'rif'

const expectedDomains: RnsDomainOffer[] = [
  {
    domainName: MOCK_OFFER_0.domain.name,
    expirationDate: new Date(MOCK_OFFER_0.domain.expiration.date),
    id: MOCK_OFFER_0.offerId,
    ownerAddress: MOCK_OFFER_0.ownerAddress,
    paymentToken: rnsTokenAddrTokenRecord[MOCK_OFFER_0.paymentToken.toLowerCase()],
    price: parseToBigDecimal(MOCK_OFFER_0.priceString, 18),
    tokenId: MOCK_OFFER_0.tokenId,
    priceFiat: Number(MOCK_OFFER_0.priceFiat),
  },
]

const isRnsDomainOffer = (obj: RnsDomainOffer): obj is RnsDomainOffer => {
  expect((obj as RnsDomainOffer).domainName).toBeTruthy()

  expect((obj as RnsDomainOffer).expirationDate).toBeTruthy()

  expect((obj as RnsDomainOffer).id).toBeTruthy()

  expect((obj as RnsDomainOffer).ownerAddress).toBeTruthy()

  expect((obj as RnsDomainOffer).paymentToken).toBeTruthy()

  expect((obj as RnsDomainOffer).price).toBeTruthy()

  expect((obj as RnsDomainOffer).tokenId).toBeTruthy()

  return true
}

let offersAPI: OffersService

describe('OffersService', () => {
  beforeEach(() => {
    offersAPI = new OffersService()
    offersAPI.errorReporter = jest.fn()
  })

  describe('_fetch via super.fetch', () => {
    beforeEach(() => {
      offersAPI.service = mockFeathersService(MOCK_TRANSPORT)
    })

    test('should return RnsDomainOffer[] on success', async () => {
      const actualReturnValue: RnsDomainOffer[] = await offersAPI.fetch(MOCK_FILTERS)

      expect(isRnsDomainOffer(actualReturnValue[0])).toBe(true)
    })

    test('should return correct RnsDomainOffer[] on success', async () => {
      const actualReturnValue = await offersAPI.fetch(MOCK_FILTERS)
      expect(actualReturnValue).toStrictEqual(expectedDomains)
    })
  })
})
