import { ServiceOrder, ServiceState } from 'context/Services/interfaces'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { Dispatch } from 'react'
import { Modify } from 'utils/typeUtils'
import { contextName } from './Context'

// STATE
export type ContextName = typeof contextName

export type OffersListing = {
  items: NotifierOfferItem[]
}

export type OffersOrder = Omit<ServiceOrder<NotifierOfferItem>, 'isOutdated'>

export type State = Modify<ServiceState<NotifierOfferItem>, {
  listing: OffersListing
  order?: OffersOrder
}>

// PAYLOAD
export type ListingPayload = Pick<OffersListing, 'items'>
export interface RefreshPayload {
  refresh: boolean
}

// ACTIONS
export type Action =
  | {
    type: 'SET_LISTING'
    payload: ListingPayload
  }

export type Actions = {
  SET_LISTING: (state: State, payload: ListingPayload) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
