import { ConfirmationsItem } from 'api/rif-marketplace-cache/confirmationsController'
import { StoreDispatcher } from 'store/storeUtils/interfaces'

export enum BLOCKCHAIN_ACTIONS {
    NOOP = 'NOOP',
    SET_CONFIRMATIONS = 'SET_CONFIRMATIONS',
    CONNECT_CONFIRMATIONS = 'CONNECT_CONFIRMATIONS',
    SET_TX_HASH = 'SET_TX_HASH',
    CLEAR_CONFIRMATIONS = 'CLEAR_CONFIRMATIONS'
}

export interface AddTxPayload {
    txHash: string
}

export type ConfirmationsPayload = ConfirmationsItem

export interface ConnectionPayload {
    isConnected: boolean
}

export type BlockchainPayload = ConfirmationsPayload & ConnectionPayload & AddTxPayload

export interface BlockchainAction extends StoreDispatcher<BlockchainPayload> {
    type: BLOCKCHAIN_ACTIONS
}
