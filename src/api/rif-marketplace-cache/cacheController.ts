import { MarketItem } from 'models/Market';
import LocalStorage from 'utils/LocalStorage'
const persistence = LocalStorage.getInstance()

export const addMarketItem = async (item: MarketItem, type: string) => {
    const itemCollection: MarketItem[] = JSON.parse(localStorage.getItem(type) || '[]');
    itemCollection.push(item);
    persistence.setItem(type, itemCollection);
}

export const updateMarketItem = async (item_id: string, updated_item: MarketItem, type: string) => {
    const itemCollection: MarketItem[] = JSON.parse(localStorage.getItem(type) || '[]');
    const newCollection: MarketItem[] = itemCollection.map(item => {
        if (item._id === item_id) return updated_item;
        return item;
    });
    persistence.setItem(type, newCollection);
}

export const getMarketItem = async (item_id: string, type: string) => {
    const itemCollection: MarketItem[] = persistence.getItem(type)
    return itemCollection.find(item => item._id === item_id)
}