import { testTransferDomains, testDomainItems } from "testdata/domains"
import { maplistingToType } from "./utils"
import { MarketListingTypes } from "models/Market"

describe('api/utils', () => {
    beforeEach(() => {
    })

    afterAll(() => {
    })

    describe('maplistingToType', () => {
        it('should return array of MarketItemType', () => {
            const transferDomains = [...testTransferDomains];

            expect(maplistingToType(transferDomains, MarketListingTypes.domainListing))
                .toStrictEqual(testDomainItems)
        })
    })
})
