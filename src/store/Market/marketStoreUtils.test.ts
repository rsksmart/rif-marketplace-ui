import { addItem, updateItem, getItem } from './../../api/rif-marketplace-cache/cacheController';
import { MarketListingType } from '../../models/Market';
import { DomainItemType } from '../../models/marketItems/DomainItem';
import LocalStorage from '../../utils/LocalStorage'
import { domainListing } from 'data/domains';

const persistence = LocalStorage.getInstance()

const persistenceSpy = {
    getItem: jest.spyOn(persistence, 'getItem'),
    setItem: jest.spyOn(persistence, 'setItem'),
}


describe('marketStoreUtils', () => {
    beforeEach(() => {
        persistence.clear()
    })

    afterAll(() => {
        persistence.clear()
    })

    
    test('add market store item should call set item', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, MarketListingType.domainListing);
        
        expect(persistenceSpy.setItem).toBeCalledWith(MarketListingType.domainListing, [item]);

    })
    test('add market store item should store item', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, MarketListingType.domainListing);
        getItem(item._id, MarketListingType.domainListing).then(actual => {
            expect(actual).toStrictEqual(item)
        })
    })

    test('update market store item should call set item', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, MarketListingType.domainListing)

        const newItem = {...item};
        newItem.currency = 'GBP';

        updateItem(item._id, newItem, MarketListingType.domainListing);

        expect(persistenceSpy.setItem).toBeCalledWith(MarketListingType.domainListing, [newItem]);
    })

    test('update market store item should not equal previous item', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, MarketListingType.domainListing)

        const newItem = { ...item };
        newItem.currency = 'GBP';

        updateItem(item._id, newItem, MarketListingType.domainListing);

        expect(persistenceSpy.setItem).toBeCalledWith(MarketListingType.domainListing, [newItem]);
        getItem(newItem._id, MarketListingType.domainListing).then(actual => expect(actual).not.toEqual(item))
    })

    test('update market store item should equal new item', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, MarketListingType.domainListing)

        const newItem = { ...item };
        newItem.currency = 'GBP';

        updateItem(item._id, newItem, MarketListingType.domainListing);

        expect(persistenceSpy.setItem).toBeCalledWith(MarketListingType.domainListing, [newItem]);
        getItem(newItem._id, MarketListingType.domainListing).then(actual => expect(actual).toStrictEqual(newItem))
    })
})