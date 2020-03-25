import { IAction } from 'store/storeUtils/interfaces';
import { MarketItem, MarketListingType, MarketItemType } from 'models/Market';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  SET_ITEMS = "SET_ITEMS"
  // GET_ITEM = 'GET_ITEM',
}

export interface ItemPayload {
  listingType: MarketListingType,
  item: MarketItem
}

export interface ListingPayload {
  listingType: MarketListingType,
  items: MarketItemType[];
}

export type MarketPayload = ItemPayload & ListingPayload

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}