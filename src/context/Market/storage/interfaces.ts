import Big from 'big.js'
import { ContextState } from 'context/storeUtils/interfaces'
import {
  BillingPlan,
  StorageOffer,
  SubscriptionPeriod,
} from 'models/marketItems/StorageItem'
import { Dispatch } from 'react'

export type StorageBillingPlan = BillingPlan & {
  internalId?: number
}

// STATE
export const contextID = 'storage_offer_edit' as const
export type ContextName = typeof contextID

export type State = ContextState & {
  system: string
  totalCapacity: Big
  country: string
  billingPlans: StorageBillingPlan[]
  internalCounter: number // counter to assign unique ids to billingPlans, this counter only sums up
  allBillingPeriods: SubscriptionPeriod[]
  peerId: string
  usedPeriodsPerCurrency: Record<string, SubscriptionPeriod[]> // dictionary to easily know the timePeriods already used by a given currency
  originalOffer?: StorageOffer
}

// PAYLOAD
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

// ACTIONS
export type Action = (
  | {
    type: 'ADD_ITEM'
    payload: StorageBillingPlan
  }
  | {
    type: 'CLEAN_UP'
  }
  | {
    type: 'REMOVE_ITEM'
    payload: StorageBillingPlan
  }
  | {
    type: 'EDIT_ITEM'
    payload: StorageBillingPlan
  }
  | {
    type: 'SET_COUNTRY'
    payload: SetCountryPayload
  }
  | {
    type: 'SET_TOTAL_CAPACITY'
    payload: SetTotalCapacityPayload
  }
  | {
    type: 'SET_PEER_ID'
    payload: SetPeerIdPayload
  }
  | {
    type: 'SET_OFFER'
    payload: SetOfferPayload
  }
)

export type Actions = {
  ADD_ITEM: (state: State, payload: StorageBillingPlan) => State
  CLEAN_UP: () => State
  REMOVE_ITEM: (state: State, payload: StorageBillingPlan) => State
  EDIT_ITEM: (state: State, payload: StorageBillingPlan) => State
  SET_COUNTRY: (state: State, payload: SetCountryPayload) => State
  SET_TOTAL_CAPACITY: (state: State, payload: SetTotalCapacityPayload) => State
  SET_PEER_ID: (state: State, payload: SetPeerIdPayload) => State
  SET_OFFER: (state: State, payload: SetOfferPayload) => State
}

// PROPS
export interface Props {
  state: State
  dispatch: Dispatch<Action>
}
