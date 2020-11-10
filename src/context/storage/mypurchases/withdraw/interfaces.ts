import { Status } from 'components/templates/ProgressOverlay'
import { Agreement } from 'models/marketItems/StorageItem'
import { Dispatch } from 'react'

// STATE
export type State = {
  agreement?: Agreement
  status: Status
}

// PAYLOAD
export type StatusPayload = (
  | {
    inProgress: boolean
    isDone?: never
  } | {
    inProgress?: never
    isDone: true
  }
)

// ACTIONS
export type Action = (
  | {
    type: 'SET_AGREEMENT'
    payload: Agreement
  }
  | {
    type: 'SET_STATUS'
    payload: StatusPayload
  }
)

export type Actions = {
  SET_AGREEMENT: (state: State, payload: Agreement) => State
  SET_STATUS: (state: State, payload: StatusPayload) => State
}

export type AsyncAction = {
  (args?: unknown): Promise<void>
}

export type AsyncActions = {
  withdraw: AsyncAction
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
  asyncActions: AsyncActions
}
