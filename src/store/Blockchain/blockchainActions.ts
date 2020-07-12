import { ConfirmationsItem } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { StoreDispatcher } from 'store/storeUtils/interfaces'

export type BLOCKCHAIN_ACTIONS = 'NOOP' | 'SET_CONFIRMATIONS' | 'SET_TX_HASH' | 'CLEAR_CONFIRMATIONS'

export interface AddTxPayload {
    txHash: string
}

export type ConfirmationsPayload = ConfirmationsItem

export type BlockchainPayload = ConfirmationsPayload & AddTxPayload

export interface BlockchainAction extends StoreDispatcher<BlockchainPayload> {
    type: BLOCKCHAIN_ACTIONS
}
