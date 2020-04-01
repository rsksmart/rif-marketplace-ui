import { IAction } from 'store/storeUtils/interfaces';
import { MarketItem, MarketListingType, MarketItemType } from 'models/Market';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  SET_ITEMS = "SET_ITEMS"
  // GET_ITEM = 'GET_ITEM',
  ,
  SET_BUY_ITEM = "SET_BUY_ITEM"
}

export interface ItemPayload {
  listingType: MarketListingType,
  item: MarketItem
  txType: 'buy' | 'list'
  isProcessing: boolean
}

export interface ListingPayload {
  listingType: MarketListingType,
  items: MarketItemType[];
}

export type MarketPayload = ItemPayload & ListingPayload

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}