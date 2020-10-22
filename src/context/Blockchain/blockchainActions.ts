import { ConfirmationsItem } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { ContextDispatch } from 'context/storeUtils/interfaces'
import { AwaitingServices } from './BlockchainContext'

export type BLOCKCHAIN_ACTION = 'NOOP' | 'SET_CONFIRMATIONS' | 'SET_TX_HASH' | 'CLEAR_CONFIRMATIONS' | 'SET_AWAITING_CONFIRMATIONS'

export interface AddTxPayload {
    txHash: string
}

export type ConfirmationsPayload = ConfirmationsItem

export type AwaitingConfirmationsPayload = {
    service: AwaitingServices
    isAwaiting: boolean
}

export type BlockchainPayload = ConfirmationsPayload &
    AddTxPayload &
    AwaitingConfirmationsPayload

export type BlockchainAction = ContextDispatch<BLOCKCHAIN_ACTION, BlockchainPayload>
