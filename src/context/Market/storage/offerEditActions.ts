import { ContextDispatch, ContextPayload } from 'context/storeUtils/interfaces'
import { StoragePlanItem } from './interfaces'
import { OfferEditReducer } from './offerEditReducer'

export type OFFER_EDIT_ACTION =
  | 'ADD_ITEM'
  | 'CLEAN_UP'
  | 'REMOVE_ITEM'
  | 'EDIT_ITEM'
  | 'SET_COUNTRY'
  | 'SET_AVAILABLE_SIZE'
  | 'SET_PEER_ID'
  | 'SET_OFFER'

export type OfferEditActions = {
  ADD_ITEM: OfferEditReducer<AddItemPayload>
  CLEAN_UP: OfferEditReducer<{}>
  REMOVE_ITEM: OfferEditReducer<RemoveItemPayload>
  EDIT_ITEM: OfferEditReducer<EditItemPayload>
  SET_COUNTRY: OfferEditReducer<SetCountryPayload>
  SET_AVAILABLE_SIZE: OfferEditReducer<SetAvailableSizePayload>
  SET_PEER_ID: OfferEditReducer<SetPeerIdPayload>
  SET_OFFER: OfferEditReducer<SetOfferPayload>
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

export interface SetOfferPayload {
  availableSize: number
  country: string
  peerId: string
  planItems: StoragePlanItem[]
  system: string
  offerId?: string
}

export type OfferEditPayload =
  | ContextPayload
  | AddItemPayload
  | RemoveItemPayload
  | EditItemPayload
  | SetAvailableSizePayload
  | SetCountryPayload
  | SetPeerIdPayload
  | SetOfferPayload

export type OfferEditAction = ContextDispatch<
  OFFER_EDIT_ACTION,
  OfferEditPayload
>
