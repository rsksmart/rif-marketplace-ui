import { IAction } from 'store/storeUtils/interfaces';
import { MarketItemIface, MarketListingTypes, MarketItemType, MarketFilter } from 'models/Market';
import { TxType } from './MarketStore';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  SET_ITEMS = "SET_ITEMS",
  SELECT_ITEM = "SELECT_ITEM",
  SET_FILTER = "SET_FILTER",
  TOGGLE_TX_TYPE = "TOGGLE_TX_TYPE",
  CONNECT_SERVICE = "CONNECT_SERVICE"
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
  filterItems: MarketFilter;
}

export interface ConnectionPayload {
  servicePath: string,
  listingType: MarketListingTypes,
  txType: TxType,
}

export interface TxTypeChangePayload {
  txType: TxType,
}

export type MarketPayload = ItemPayload & ListingPayload & FilterPayload & ConnectionPayload & TxTypeChangePayload

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}