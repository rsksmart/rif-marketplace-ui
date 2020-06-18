import { ConfirmationsItem } from 'api/rif-marketplace-cache/confirmationsController';
import { ActionType } from 'store/storeUtils/interfaces';

export enum BLOCKCHAIN_ACTIONS {
    NOOP = 'NOOP',
    SET_CONFIRMATIONS = "SET_CONFIRMATIONS",
    CONNECT_CONFIRMATIONS = "CONNECT_CONFIRMATIONS",
    SET_TX_HASH = "SET_TX_HASH",
}

type Modify<T, R> = Omit<T, keyof R> & R;

export interface AddTxPayload {
    txHash: string
}

export interface ConfirmationsPayload extends ConfirmationsItem { }

export interface ConnectionPayload {
    isConnected: boolean
}

export type BlockchainPayload = ConfirmationsPayload & ConnectionPayload & AddTxPayload


export interface BlockchainAction extends ActionType<BlockchainPayload> {
    type: BLOCKCHAIN_ACTIONS
}