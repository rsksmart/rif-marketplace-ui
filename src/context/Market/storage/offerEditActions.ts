import Big from 'big.js'
import { ContextDispatch, ContextPayload } from 'context/storeUtils/interfaces'
import { StorageOffer } from 'models/marketItems/StorageItem'
import { StorageBillingPlan } from './interfaces'
import { OfferEditReducer } from './offerEditReducer'

export type OFFER_EDIT_ACTION =
  | 'ADD_ITEM'
  | 'CLEAN_UP'
  | 'REMOVE_ITEM'
  | 'EDIT_ITEM'
  | 'SET_COUNTRY'
  | 'SET_TOTAL_CAPACITY'
  | 'SET_PEER_ID'
  | 'SET_OFFER'

export type OfferEditActions = {
  ADD_ITEM: OfferEditReducer<AddItemPayload>
  CLEAN_UP: OfferEditReducer<{}>
  REMOVE_ITEM: OfferEditReducer<RemoveItemPayload>
  EDIT_ITEM: OfferEditReducer<EditItemPayload>
  SET_COUNTRY: OfferEditReducer<SetCountryPayload>
  SET_TOTAL_CAPACITY: OfferEditReducer<SetTotalCapacityPayload>
  SET_PEER_ID: OfferEditReducer<SetPeerIdPayload>
  SET_OFFER: OfferEditReducer<SetOfferPayload>
}

export type AddItemPayload = StorageBillingPlan

export interface RemoveItemPayload {
  internalId: number
}

export type EditItemPayload = AddItemPayload & RemoveItemPayload

export interface SetTotalCapacityPayload {
  totalCapacity: Big
}

export interface SetCountryPayload {
  country: string
}

export interface SetPeerIdPayload {
  peerId: string
}

export type SetOfferPayload = StorageOffer

export type OfferEditPayload =
  | ContextPayload
  | AddItemPayload
  | RemoveItemPayload
  | EditItemPayload
  | SetTotalCapacityPayload
  | SetCountryPayload
  | SetPeerIdPayload
  | SetOfferPayload

export type OfferEditAction = ContextDispatch<
  OFFER_EDIT_ACTION,
  OfferEditPayload
>
