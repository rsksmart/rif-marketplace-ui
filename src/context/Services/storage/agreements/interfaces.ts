import { Dispatch } from 'react'
import { Agreement } from 'models/marketItems/StorageItem'
import { ContextProps, ContextState } from 'context/storeUtils/interfaces'
import { AgreementFilters } from 'api/rif-marketplace-cache/storage/interfaces'

// STATE
export type ContextName = 'storage_agreements'
export type State = ContextState & {
  agreements: Agreement[]
  order?: Agreement
  filters?: AgreementFilters
}

// PAYLOAD

// ACTIONS
export type Action = (
    | {
      type: 'SET_LISTING'
      payload: Agreement[]
    }
    | {
      type: 'SET_ORDER'
      payload: Agreement
    }
  | {
    type: 'SET_FILTERS'
    payload: AgreementFilters
  }
)

export type ActionFunctions = {
  SET_LISTING: (state: State, payload: Agreement[]) => State
  SET_ORDER: (state: State, payload: Agreement) => State
  SET_FILTERS: (state: State, payload: AgreementFilters) => State
}

// PROPS
export type Props = ContextProps<State, Action>
