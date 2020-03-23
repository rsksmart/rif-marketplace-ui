// import { Contact, User } from 'models';
import { IAction } from 'store/storeUtils/interfaces';
import { MarketItemType } from 'models/Market';

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  GET_ITEM = 'GET_ITEM',
  FILTER_ITEMS = 'FILTER_ITEMS'
}


export interface ItemPayload {
  itemType: string,
  item_id: string
}

export interface FilterPayload {
  filterType: Function,
  filterData: {
    filterParam: FilterParam,
    itemType: string
  }
}

export type MarketPayload = ItemPayload & FilterPayload

export interface MarketAction extends IAction<MarketPayload> {
  type: MARKET_ACTIONS
}

interface FilterParam {
  name: string,
  value: string
}

enum FILTER_TYPES {
  PRICE_MIN_USD = 'PRICE_MIN_USD',
}

type IMarketFilters = {
  [key in FILTER_TYPES]: (param: FilterParam, collection: MarketItemType[]) => MarketItemType[]
}

const {
  PRICE_MIN_USD,
} = FILTER_TYPES;

export const MarketFilters: IMarketFilters = {
  [PRICE_MIN_USD]: (param: FilterParam, collection: MarketItemType[]) => {
    const {name, value} = param; 
    return collection.filter(item => item[name] >= value)
  }
}