import { initialState } from 'store/Blockchain/BlockchainStore'
import Logger from 'utils/Logger'
import {
  BlockchainAction, BlockchainPayload, BLOCKCHAIN_ACTIONS, ConfirmationsPayload, ConnectionPayload, AddTxPayload,
} from './blockchainActions'
import { BlockchainState } from './BlockchainStore'

const logger = Logger.getInstance()

const {
  CLEAR_CONFIRMATIONS,
  CONNECT_CONFIRMATIONS,
  NOOP,
  SET_CONFIRMATIONS,
  SET_TX_HASH,
} = BLOCKCHAIN_ACTIONS

type IBlockchainActions = {
  [key in BLOCKCHAIN_ACTIONS]: (state: BlockchainState, payload: BlockchainPayload) => BlockchainState
}

const blockchainActions: IBlockchainActions = {
  [NOOP]: (state, _) => state,
  [SET_TX_HASH]: (state, payload: AddTxPayload) => {
    const { txHash } = payload
    const { confirmations: { isConnected } } = state
    return {
      ...state,
      confirmations: { isConnected, txHash },
    }
  },
  [SET_CONFIRMATIONS]: (state, payload: ConfirmationsPayload) => {
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
  [CONNECT_CONFIRMATIONS]: (state, payload: ConnectionPayload) => {
    const { isConnected } = payload

    return {
      ...state,
      confirmations: {
        isConnected,
      },
    }
  },
  [CLEAR_CONFIRMATIONS]: (state, _: BlockchainPayload) => ({ ...state, confirmations: { isConnected: state.confirmations.isConnected } }),

}

// TODO: Extract reusable
const blockchainReducer = (state = initialState, action: BlockchainAction) => {
  const { type, payload } = action
  const userAction = blockchainActions[type]

  logger.debug('Blockchain action:', action)
  const newState = (!!userAction && userAction(state, payload)) || state

  if (state !== newState) {
    logger.debug('Prev state:', state)
    logger.debug('Next state:', newState)
  } else {
    logger.debug('No change:', newState)
  }

  return newState
}
export default blockchainReducer
