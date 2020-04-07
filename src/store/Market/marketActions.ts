import { IAction } from 'store/storeUtils/interfaces';
import { MarketItemIface, MarketListingTypes, MarketItemType, MarketFilterIface } from 'models/Market';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  SET_ITEMS = "SET_ITEMS"
  // GET_ITEM = 'GET_ITEM',
  ,
  SET_BUY_ITEM = "SET_BUY_ITEM",
  SET_FILTER = "SET_FILTER"
}

export interface ItemPayload {
  listingType: MarketListingTypes,
  item: MarketItemIface
  txType: 'buy' | 'list'
  isProcessing: boolean
}

export interface ListingPayload {
  listingType: MarketListingTypes,
  items: MarketItemType[];
}

export interface FilterPayload {
  listingType: MarketListingTypes,
  filterItems: MarketFilterIface
}

export type MarketPayload = ItemPayload & ListingPayload & FilterPayload

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}