import { StoreDispatcher } from 'store/storeUtils/interfaces'
import {
  MarketItem, MarketListingTypes, MarketItemType, MarketFilter,
} from 'models/Market'
import { TxType } from './MarketStore'

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  SET_ITEMS = 'SET_ITEMS',
  SELECT_ITEM = 'SELECT_ITEM',
  SET_PROG_STATUS = 'SET_PROG_STATUS',
  SET_FILTER = 'SET_FILTER',
  TOGGLE_TX_TYPE = 'TOGGLE_TX_TYPE',
  CONNECT_SERVICE = 'CONNECT_SERVICE',
  SET_EXCHANGE_RATE = 'SET_EXCHANGE_RATE',
  CLEAN_UP = 'CLEAN_UP',
  SET_META = 'SET_META',
  OUTDATE = "OUTDATE"
}

export interface ItemPayload {
  listingType: MarketListingTypes
  item: MarketItem
  txType: TxType
  isProcessing: boolean
}

export interface ListingPayload {
  items: MarketItemType[]
}

export interface FilterPayload {
  filterItems: MarketFilter
}

export interface ConnectionPayload {
  servicePath: string
  listingType: MarketListingTypes
  txType: TxType
  items: MarketItemType[]
}

export interface ExchangeRatePayload {
  [symbol: string]: {
    displayName: string
    rate: number
  }
}

export interface ProgressStatusPayload {
  isProcessing: boolean
}

export interface MetadataPayload {
  updatedTokenId: string
}

export interface CleanupPayload {
  currentListing?: boolean
  currentOrder?: boolean
}

export interface TxTypeChangePayload {
  txType: TxType
}

export type MarketPayloadType = ItemPayload & FilterPayload & ConnectionPayload & TxTypeChangePayload & ExchangeRatePayload & ListingPayload & MetadataPayload & CleanupPayload & ProgressStatusPayload

export interface MarketAction extends StoreDispatcher<MarketPayloadType> {
  type: MARKET_ACTIONS
}
