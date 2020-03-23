import { addMarketItem, updateMarketItem, getMarketItem } from './cacheController';
import { DomainItemType } from 'models/Market';
import { domainListing } from 'models/marketItems/DomainItem';
import LocalStorage from 'utils/LocalStorage'
const persistence = LocalStorage.getInstance()


// const localStorageMock = {
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   removeItem: jest.fn(),
//   clear: jest.fn(),
// };

// const localStorageSetItem_spy = jest.spyOn(window.localStorage.__proto__, 'setItem');
const persistenceSpy = {
    getItem: jest.spyOn(persistence, 'getItem'),
    setItem: jest.spyOn(persistence, 'setItem'),
}

// globalAny.localStorage = localStorageMock;

describe('api/cacheController', () => {
    const ItemType = {
        storage: 'storage',
        domain: 'domain'
    }

    beforeEach(() => {
        window.localStorage.clear()
    })

    test('adds item to cache', () => {
        const item: DomainItemType = domainListing[0];
        addMarketItem(item, ItemType.domain);
        
        expect(persistenceSpy.setItem).toBeCalledWith(ItemType.domain, [item]);
        // expect(localStorage.setItem).toBeCalledWith(ItemType.domain, `[${JSON.stringify(item)}]`);
        // expect(localStorageSetItem_spy).toBeCalledWith(ItemType.domain, `[${JSON.stringify(item)}]`);
    })

    test('updates item in cache', () => {
        const item: DomainItemType = domainListing[0];
        addMarketItem(item, ItemType.domain)

        const newItem = item;
        newItem.currency = 'GBP';

        updateMarketItem(item._id, newItem, ItemType.domain);

        expect(persistenceSpy.setItem).toBeCalledWith(ItemType.domain, [newItem]);
        // expect(localStorage.setItem).toBeCalledWith(ItemType.domain, `[${JSON.stringify(newItem)}]`);
    })

    test('get items', () => {
        const expectedItem: DomainItemType = domainListing[0];
        addMarketItem(expectedItem, ItemType.domain);

        getMarketItem(expectedItem._id, ItemType.domain).then(item => expect(item).toBe(expectedItem))
    })
})
