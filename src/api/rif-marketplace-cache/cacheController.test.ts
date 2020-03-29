import { addItem, updateItem, getItem, fetchMarketDataFor } from './cacheController';
import { MarketListingType } from 'models/Market';
import { DomainItemType } from 'models/marketItems/DomainItem';
import LocalStorage from 'utils/LocalStorage'
import { domainListing } from 'data/domains';
const persistence = LocalStorage.getInstance()

describe('api/cacheController', () => {
    beforeEach(() => {
        persistence.clear()
        persistence.setItem(MarketListingType.domainListing, domainListing);
    })

    afterAll(() => {
        persistence.clear()
        persistence.setItem(MarketListingType.domainListing, domainListing);
    })

    test('adds item to cache', async () => {
        const newItem: DomainItemType = {
            _id: 'test_id',
            currency: 'TEST_COIN',
            domain: 'test_domain',
            price: 9999999,
            price_fiat: 99999,
            tld: 'test_tld',
            seller: 'test_user'
        };
        await addItem(newItem, MarketListingType.domainListing);

        expect(persistence.getItem(MarketListingType.domainListing)).toContainEqual(newItem)
        
    })

    test('updates item in cache', async () => {
        const item: DomainItemType = domainListing[0];

        const newItem = {...item};
        newItem.currency = 'TEST_COIN';

        await updateItem(item._id, newItem, MarketListingType.domainListing);

        expect(persistence.getItem('domainListing')).toContainEqual(newItem)
    })

    test('get item from cache', async () => {
        const expectedItem: DomainItemType = domainListing[0];

        const item = await getItem(expectedItem._id, MarketListingType.domainListing);
        expect(item).toStrictEqual(expectedItem)
    })

    test('fetchMarketDataFor(listingType) should return promise with list of items for the given listing type', async () => {
        const expectedListing: DomainItemType[] = domainListing;
        const listingType: MarketListingType = MarketListingType.domainListing;
        persistence.setItem(listingType, domainListing)

        const data = await fetchMarketDataFor(listingType);
        
        expect(data).toStrictEqual(expectedListing);
    })
})
