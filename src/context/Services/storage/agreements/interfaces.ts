import { Dispatch } from 'react'
import { Agreement } from 'models/marketItems/StorageItem'
import { ContextState } from 'context/storeUtils/interfaces'

// STATE
export type ContextName = 'storage_agreements'
export type State = ContextState & {
  agreements: Agreement[]
}

// PAYLOAD

// ACTIONS
export type Action = (
    | {}
)

export type ActionFunctions = {

}

// PROPS
export type Props = {
    state: State
    dispatch: Dispatch<Action>
}
