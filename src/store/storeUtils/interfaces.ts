import { RnsStoreNames } from "store/Market/rns/interfaces"


export type AvailableStores = RnsStoreNames

export interface StorePayload {
  [key: string]: any //TODO: make into [K in keyof T]: any where T is StoreState
}

export interface StoreDispatcher<T> {
  readonly type: string
  readonly payload: T
}

export interface StoreState {
  storeID: AvailableStores
}

export interface StoreReducer {
  (state: StoreState, dispatcher: StoreDispatcher<StorePayload>): StoreState
}

export interface StoreAction {
  (state: StoreState, payload: StorePayload): StoreState
}

export type StoreActions = {
  [key: string]: StoreAction
}