import { addItem, updateItem, getItem } from './cacheController';
import { MarketListingType } from 'models/Market';
import { domainListing, DomainItemType } from 'models/marketItems/DomainItem';
import LocalStorage from 'utils/LocalStorage'
const persistence = LocalStorage.getInstance()

const persistenceSpy = {
    getItem: jest.spyOn(persistence, 'getItem'),
    setItem: jest.spyOn(persistence, 'setItem'),
}

describe('api/cacheController', () => {
    beforeEach(() => {
        persistence.clear()
    })

    afterAll(() => {
        persistence.clear()
    })

    test('adds item to cache', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, MarketListingType.domainListing);
        
        expect(persistenceSpy.setItem).toBeCalledWith(MarketListingType.domainListing, [item]);
    })

    test('updates item in cache', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, MarketListingType.domainListing)

        const newItem = {...item};
        newItem.currency = 'GBP';

        updateItem(item._id, newItem, MarketListingType.domainListing);

        expect(persistenceSpy.setItem).toBeCalledWith(MarketListingType.domainListing, [newItem]);
    })

    test('get item from cache', () => {
        const expectedItem: DomainItemType = domainListing[0];
        addItem(expectedItem, MarketListingType.domainListing);

        expect(persistenceSpy.getItem).toBeCalledWith(MarketListingType.domainListing);
        getItem(expectedItem._id, MarketListingType.domainListing).then(item => expect(item).toStrictEqual(expectedItem))
    })
})
