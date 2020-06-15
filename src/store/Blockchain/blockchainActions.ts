import { ActionType } from 'store/storeUtils/interfaces'

export enum BLOCKCHAIN_ACTIONS {
    NOOP = 'NOOP',
    SET_CONFIRMATIONS = "SET_CONFIRMATIONS",
    CONNECT_CONFIRMATIONS = "CONNECT_CONFIRMATIONS"
}

export interface ConfirmationsPayload {
    currentCt: number,
    targetCt: number
}

export interface ConnectionPayload {
    isConnected: boolean
}

export type BlockchainPayload = ConfirmationsPayload & ConnectionPayload


export interface BlockchainAction extends ActionType<BlockchainPayload> {
    type: BLOCKCHAIN_ACTIONS
}