import { ContextState } from 'context/storeUtils/interfaces'
import {
  Transport as ConfirmationTransport,
} from 'api/rif-marketplace-cache/blockchain/confirmations'
import { Dispatch } from 'react'

type AgreementContractAction =
  | 'AGREEMENT_NEW'
  | 'AGREEMENT_WITHDRAW'
  | 'AGREEMENT_PAYOUT'
  | 'AGREEMENT_RENEW'

type OfferContractAction = 'NEW_OFFER' | 'EDIT_OFFER' | 'CANCEL_OFFER'
type StorageStakingContractAction = 'STAKING_STAKE' | 'STAKING_UNSTAKE'

type StorageContractAction = AgreementContractAction | OfferContractAction

type BuyDomainAction = 'RNS_BUY'
type RnsContractAction = | BuyDomainAction

export type ContractAction =
  | StorageContractAction
  | StorageStakingContractAction
  | RnsContractAction

export type AgreementUpdateData = { // used for withdraw, payout and renew
  agreementId: string
}

export type AgreementContractData =
  | AgreementUpdateData

export type BuyDomainContractData = {
  tokenId: string
}

export type RnsContractData = | BuyDomainContractData

export type ContractActionData =
  | AgreementContractData
  | RnsContractData

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
