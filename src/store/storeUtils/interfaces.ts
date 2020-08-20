import { RnsStoreNames } from 'store/Services/rns/interfaces'
import { StoreName as BlockchainStoreName } from 'store/Blockchain/BlockchainStore'
import { StoreName as MarketStoreName } from 'store/Market/MarketStore'
import { StoreName as AppStoreName } from 'store/App/AppStore'
import { StoreName as StorageListingStoreName } from 'store/Services/storage/ListingStore'
import { MARKET_ACTION } from 'store/Market/marketActions'
import { APP_ACTION } from 'store/App/appActions'
import { BLOCKCHAIN_ACTION } from 'store/Blockchain/blockchainActions'
import { SERVICE_ACTION } from 'store/Services/interfaces'

export type AvailableStores =
  | RnsStoreNames
  | BlockchainStoreName
  | MarketStoreName
  | AppStoreName
  | StorageListingStoreName

export interface StorePayload {
  [key: string]: any // TODO: make into [K in keyof T]: any where T is StoreState
}

export type StoreActionType = APP_ACTION | BLOCKCHAIN_ACTION | MARKET_ACTION | SERVICE_ACTION

export interface StoreDispatcher<T extends StoreActionType, P extends StorePayload> {
  readonly type: T
  readonly payload: P
}

export interface StoreState {
  storeID: AvailableStores
}

export interface StoreReducer {
  (state: StoreState, dispatcher: StoreDispatcher<StoreActionType, StorePayload>): StoreState
}

export interface StoreAction {
  (state: StoreState, payload: StorePayload): StoreState
}

export type StoreActions = {
  [key: string]: StoreAction
}