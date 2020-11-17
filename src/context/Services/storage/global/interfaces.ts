import { Dispatch } from 'react'

// STATE
export type State = {
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
  SET_IS_WHITELISTED_PROVIDER: (state: State, payload: IsWhitelistedProviderPayload) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
