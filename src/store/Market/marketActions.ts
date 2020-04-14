import { IAction } from 'store/storeUtils/interfaces';
import { MarketItemIface, MarketListingTypes, MarketItemType, MarketFilterIface } from 'models/Market';
import { TxType } from './MarketStore';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  SET_ITEMS = "SET_ITEMS"
  // GET_ITEM = 'GET_ITEM',
  ,
  SET_BUY_ITEM = "SET_BUY_ITEM",
  SET_FILTER = "SET_FILTER",
  TOGGLE_TX_TYPE = "TOGGLE_TX_TYPE"
}

export interface ItemPayload {
  listingType: MarketListingTypes;
  item: MarketItemIface;
  txType: TxType;
  isProcessing: boolean;
}

export interface ListingPayload {
  listingType: MarketListingTypes;
  items: MarketItemType[];
}

export interface FilterPayload {
  listingType: MarketListingTypes;
  filterItems: MarketFilterIface;
}

export type MarketPayload = ItemPayload & ListingPayload & FilterPayload

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}