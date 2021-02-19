import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem, StorageOffer } from 'models/marketItems/StorageItem'
import { ContextState } from 'context/storeUtils/interfaces'
import { Dispatch } from 'react'
import { ServiceOrder, ServiceState } from '../interfaces'
import { StorageOffersContextName } from './offers'
import { AgreementContextName } from './agreements'
import { ContextName as StorageGlobalContextName } from './Context'
import { StorageStakingContextName } from './staking'

export type StorageContextNames =
  | StorageOffersContextName
  | StorageStakingContextName
  | AgreementContextName
  | StorageGlobalContextName

export type StorageState = ServiceState<StorageItem> & {
  filters: StorageOffersFilters
  limits: Pick<StorageOffersFilters, 'price' | 'size'>
}

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
