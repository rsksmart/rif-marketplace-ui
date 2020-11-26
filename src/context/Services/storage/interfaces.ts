import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem, StorageOffer } from 'models/marketItems/StorageItem'
import { ContextState } from 'context/storeUtils/interfaces'
import { Dispatch } from 'react'
import { ServiceOrder, ServiceState } from '../interfaces'
import { OFFERS_ACTION } from './offers/offersActions'
import { ContextName as OffersContextName } from './offers/OffersContext'
import { ContextName as AgreementContextName } from './agreements/interfaces'
import { ContextName as StorageGlobalContextName } from './Context'

export type StorageContextNames =
  | OffersContextName
  | AgreementContextName
  | StorageGlobalContextName

export type StorageState = ServiceState<StorageItem> & {
  filters: StorageOffersFilters
  limits: Pick<StorageOffersFilters, 'price' | 'size'>
}

export type STORAGE_ACTION = OFFERS_ACTION

export type PinnedContent = {
  contentName: string
  contentSize: string
  contentHash: string
}

export type StorageOrder = Omit<ServiceOrder<StorageOffer>, 'isOutdated'>

// STATE
export type State = ContextState & {
  isWhitelistedProvider?: boolean
}

// PAYLOAD
export type IsWhitelistedProviderPayload = {
  isWhitelistedProvider: boolean
}

// ACTIONS
export type Action = (
  | {
    type: 'SET_IS_WHITELISTED_PROVIDER'
    payload: IsWhitelistedProviderPayload
  }
)

export type Actions = {
  SET_IS_WHITELISTED_PROVIDER: (
    state: State, payload: IsWhitelistedProviderPayload
  ) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
