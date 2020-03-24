import { IAction } from 'store/storeUtils/interfaces';
import { MarketItem, MarketListingType } from 'models/Market';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  GET_ITEM = 'GET_ITEM'
}


export interface ItemPayload {
  listingType: MarketListingType,
  item: MarketItem
}

export type MarketPayload = ItemPayload

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}