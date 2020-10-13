import { initialState } from 'store/Blockchain/BlockchainStore'
import {
  AddTxPayload, BlockchainPayload, BLOCKCHAIN_ACTIONS, ConfirmationsPayload,
} from './blockchainActions'
import { BlockchainState } from './BlockchainStore'

export interface BlockchainReducer {
  (state: BlockchainState, payload: BlockchainPayload): BlockchainState
}

type IBlockchainActions = {
  [key in BLOCKCHAIN_ACTIONS]: BlockchainReducer
}

export const blockchainActions: IBlockchainActions = {
  NOOP: (state, _) => state,
  SET_TX_HASH: (state, payload: AddTxPayload) => {
    const { txHash } = payload
    return {
      ...state,
      confirmations: { txHash },
    }
  },
  SET_CONFIRMATIONS: (state, payload: ConfirmationsPayload) => {
    const { currentCount, targetCount } = payload
    const { confirmations } = state

    return {
      ...state,
      confirmations: {
        ...confirmations,
        currentCount,
        targetCount,
      },
    }
  },
  CLEAR_CONFIRMATIONS: (_, __) => initialState,

}