import { ContextDispatch, ContextPayload } from 'context/storeUtils/interfaces'
import { StoragePlanItem, TimePeriodEnum } from './interfaces'
import { StorageSellReducer } from './storageSellReducer'

export type STORAGE_SELL_ACTION =
  | 'ADD_ITEM'
  | 'CLEAN_UP'
  | 'REMOVE_ITEM'
  | 'EDIT_ITEM'
  | 'SET_COUNTRY'
  | 'SET_AVAILABLE_SIZE'
  | 'SET_PEER_ID'

export type StorageSellActions = {
  ADD_ITEM: StorageSellReducer<AddItemPayload>
  CLEAN_UP: StorageSellReducer<{}>
  REMOVE_ITEM: StorageSellReducer<RemoveItemPayload>
  EDIT_ITEM: StorageSellReducer<EditItemPayload>
  SET_COUNTRY: StorageSellReducer<SetCountryPayload>
  SET_AVAILABLE_SIZE: StorageSellReducer<SetAvailableSizePayload>
  SET_PEER_ID: StorageSellReducer<SetPeerIdPayload>
}

export type AddItemPayload = StoragePlanItem

export interface RemoveItemPayload {
  internalId: number
}

export type EditItemPayload = AddItemPayload & RemoveItemPayload

export interface SetAvailableSizePayload {
  availableSize: number
}

export interface SetCountryPayload {
  country: string
}

export interface SetPeerIdPayload {
  peerId: string
}

export type StorageSellPayload =
  | ContextPayload
  | AddItemPayload
  | RemoveItemPayload
  | EditItemPayload
  | SetAvailableSizePayload
  | SetCountryPayload
  | SetPeerIdPayload

export type StorageSellAction = ContextDispatch<STORAGE_SELL_ACTION, StorageSellPayload>
