
import { OffersService } from "../offers";
import { OfferTransport } from "api/models/transports";
import mockFeathersService from "api/test-utils/feathers";
import { RnsDomainOffer } from "models/marketItems/DomainItem";
import { parseToBigDecimal } from "utils/parsers";
import { RnsFilter } from "api/models/RnsFilter";

const MOCK_OFFER_0: OfferTransport = {
    domain: {
        expiration: {
            date: 'Wed Jul 29 2021'
        },
        name: 'fake_name',
        owner: {
            address: 'fake_addr'
        },
        tokenId: 'fake_token_id',
    },
    offerId: 'fake_id',
    paymentToken: 'rif',
    priceString: '19000000000',
    ownerAddress: 'string',
    ownerDomain: 'string',
    tokenId: 'string'
}

const MOCK_TRANSPORT = [MOCK_OFFER_0]
const MOCK_FILTERS: RnsFilter = {
    price: {
        max: 2,
        min: 3,
    }
}

const expectedDomains: RnsDomainOffer[] = [
    {
        domainName: MOCK_OFFER_0.domain.name,
        expirationDate: new Date(MOCK_OFFER_0.domain.expiration.date),
        id: MOCK_OFFER_0.offerId,
        ownerAddress: MOCK_OFFER_0.ownerAddress,
        paymentToken: MOCK_OFFER_0.paymentToken,
        price: parseToBigDecimal(MOCK_OFFER_0.priceString, 18),
        tokenId: MOCK_OFFER_0.tokenId
    }
]

const isRnsDomainOffer = (obj: any): obj is RnsDomainOffer => {
    console.log(1)
    if (!(obj as RnsDomainOffer).domainName) return false
    console.log(2)
    if (!(obj as RnsDomainOffer).expirationDate) return false
    console.log(3)
    if (!(obj as RnsDomainOffer).id) return false
    console.log(4)
    if (!(obj as RnsDomainOffer).ownerAddress) return false
    console.log(5)
    if (!(obj as RnsDomainOffer).paymentToken) return false
    console.log(6)
    if (!(obj as RnsDomainOffer).price) return false
    console.log(7)
    if (!(obj as RnsDomainOffer).tokenId) return false
    console.log(8)

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
            const actualReturnValue = await offersAPI.fetch(MOCK_FILTERS)
            expect(isRnsDomainOffer(actualReturnValue[0])).toBe(true)
        })
        test('should return correct RnsDomainOffer[] on success', async () => {
            const actualReturnValue = await offersAPI.fetch(MOCK_FILTERS)
            expect(actualReturnValue).toContainEqual(expectedDomains)
        })

    })

})
