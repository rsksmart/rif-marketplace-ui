import { ContextState } from 'context/storeUtils/interfaces'
import {
  Transport as ConfirmationTransport,
} from 'api/rif-marketplace-cache/blockchain/confirmations'
import { Dispatch } from 'react'

// TODO: put here all events refered to agreements so we only check that entry
//  of the dictionary when an event of that type comes - will improve performance
type AgreementsEvents = ''

export type ServiceAwaiting = 'Agreements' | 'Staking'

type ServiceConfirmations = {
  txHash: string
  currentCount: number
  targetCount: number
}

type AgreementConfirmations = ServiceConfirmations & {
  agreementId: string
}

type StakingConfirmations = ServiceConfirmations

export type ServiceConfsMap = Record<
  ServiceAwaiting,
  undefined | AgreementConfirmations | StakingConfirmations
>

// STATE
export type State = ContextState & {
  txHashServiceMap: ServiceConfsMap
}

// PAYLOAD
type NewConfirmationPayload = ConfirmationTransport

// ACTIONS
export type Action = (
  | {
    type: 'NEW_CONFIRMATION'
    payload: NewConfirmationPayload
  }
)

export type Actions = {
  NEW_CONFIRMATION: (state: State, payload: NewConfirmationPayload) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
