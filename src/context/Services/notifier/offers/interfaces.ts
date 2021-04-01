import { ServiceOrder, ServiceState } from 'context/Services/interfaces'
import { NotifierOffersFilters } from 'models/marketItems/NotifierFilters'
import { NotifierOfferItem, PriceOption } from 'models/marketItems/NotifierItem'
import { Dispatch } from 'react'
import { Modify } from 'utils/typeUtils'
import { contextName } from './Context'

// STATE
export type ContextName = typeof contextName

export type OffersListing = {
  items: NotifierOfferItem[]
}
export type OrderItem = Omit<NotifierOfferItem, 'priceOptions'> & PriceOption
export type OffersOrder = Omit<ServiceOrder<OrderItem>, 'isOutdated'>

export type ContextLimits = Pick<NotifierOffersFilters, 'price' | 'size'>

export type State = Modify<ServiceState<NotifierOfferItem>, {
  listing: OffersListing
  order?: OffersOrder
  filters: NotifierOffersFilters
  limits: ContextLimits
}>

// PAYLOAD
export type ListingPayload = Pick<OffersListing, 'items'>

export type LimitsPayload = Pick<NotifierOffersFilters, 'price' | 'size'>

export type FilterPayload = Partial<NotifierOffersFilters>

export type OrderPayload = {
  plan: NotifierOfferItem
  priceOption: PriceOption
}

export interface RefreshPayload {
  refresh: boolean
}

// ACTIONS
export type Action =
  | {
    type: 'SET_LISTING'
    payload: ListingPayload
  }
  | {
    type: 'FILTER'
    payload: FilterPayload
  }
  | {
    type: 'UPDATE_LIMITS'
    payload: LimitsPayload
  }
  | {
    type: 'SET_ORDER'
    payload: OrderPayload
  }

export type Actions = {
  SET_LISTING: (state: State, payload: ListingPayload) => State
  FILTER: (state: State, payload: FilterPayload) => State
  UPDATE_LIMITS: (state: State, payload: LimitsPayload) => State
  SET_ORDER: (state: State, payload: OrderPayload) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
