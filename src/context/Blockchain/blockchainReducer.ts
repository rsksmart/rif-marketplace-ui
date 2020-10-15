import { initialState } from 'context/Blockchain/BlockchainContext'
import {
  AddTxPayload, BlockchainPayload, BLOCKCHAIN_ACTION, ConfirmationsPayload,
} from './blockchainActions'
import { BlockchainState } from './BlockchainContext'

export interface BlockchainReducer {
  (state: BlockchainState, payload: BlockchainPayload): BlockchainState
}

type IBlockchainActions = {
  [key in BLOCKCHAIN_ACTION]: BlockchainReducer
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
