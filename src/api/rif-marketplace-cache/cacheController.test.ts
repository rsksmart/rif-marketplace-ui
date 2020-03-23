import { addItem, updateItem, getItem } from './cacheController';
import { DomainItemType } from 'models/Market';
import { domainListing } from 'models/marketItems/DomainItem';
import LocalStorage from 'utils/LocalStorage'
const persistence = LocalStorage.getInstance()

const persistenceSpy = {
    getItem: jest.spyOn(persistence, 'getItem'),
    setItem: jest.spyOn(persistence, 'setItem'),
}

describe('api/cacheController', () => {
    const ItemType = {
        storageListings: 'storageListings',
        domainListings: 'domainListings'
    }

    beforeEach(() => {
        persistence.clear()
    })

    test('adds item to cache', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, ItemType.domainListings);
        
        expect(persistenceSpy.setItem).toBeCalledWith(ItemType.domainListings, [item]);
    })

    test('updates item in cache', () => {
        const item: DomainItemType = domainListing[0];
        addItem(item, ItemType.domainListings)

        const newItem = item;
        newItem.currency = 'GBP';

        updateItem(item._id, newItem, ItemType.domainListings);

        expect(persistenceSpy.setItem).toBeCalledWith(ItemType.domainListings, [newItem]);
    })

    test('get item from cache', () => {
        const expectedItem: DomainItemType = domainListing[0];
        addItem(expectedItem, ItemType.domainListings);

        expect(persistenceSpy.getItem).toBeCalledWith(ItemType.domainListings);
        getItem(expectedItem._id, ItemType.domainListings).then(item => expect(item).toStrictEqual(expectedItem))
    })
})
