import { ContextState } from 'context/storeUtils/interfaces'
import {
  Transport as ConfirmationTransport,
} from 'api/rif-marketplace-cache/blockchain/confirmations'
import { Dispatch } from 'react'

type AgreementContractAction = 'AGREEMENT_NEW' | 'AGREEMENT_WITHDRAW' | 'AGREEMENT_PAYOUT'
type StakingContractAction = 'STAKING_STAKE' | 'STAKING_UNSTAKE'

export type ContractAction =
  | AgreementContractAction
  | StakingContractAction

export type AgreementWithdrawData = {
  agreementReference: string
}

export type AgreementPayoutData = {
  agreementReference: string
}

export type AgreementContractData =
  | AgreementWithdrawData
  | AgreementPayoutData

export type ContractActionData =
  | AgreementContractData

export type TxHash = string

export type ConfirmationData = {
  contractAction: ContractAction
  currentCount: number
  targetCount?: number
  contractActionData?: ContractActionData
}

export type ConfirmationsRecord = Record<
  TxHash, ConfirmationData
>

// STATE
export type State = ContextState & {
  confirmations: ConfirmationsRecord
}

// PAYLOAD
export type NewConfirmationPayload = ConfirmationTransport
export type NewRequestPayload = {
  txHash: string
  contractAction: ContractAction
  contractActionData?: ContractActionData
}

// ACTIONS
export type Action = (
  | {
    type: 'NEW_CONFIRMATION'
    payload: NewConfirmationPayload
  }
  | {
    type: 'NEW_REQUEST'
    payload: NewRequestPayload
  }
)

export type Actions = {
  NEW_CONFIRMATION: (state: State, payload: NewConfirmationPayload) => State
  NEW_REQUEST: (state: State, payload: NewRequestPayload) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}