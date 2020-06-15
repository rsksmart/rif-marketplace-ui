import { initialState } from "store/Blockchain/BlockchainStore"
import Logger from "utils/Logger"
import { BlockchainAction, BlockchainPayload, BLOCKCHAIN_ACTIONS, ConfirmationsPayload, ConnectionPayload } from "./blockchainActions"
import { BlockchainState } from "./BlockchainStore"

const logger = Logger.getInstance()

const {
    NOOP,
    SET_CONFIRMATIONS,
    CONNECT_CONFIRMATIONS,
} = BLOCKCHAIN_ACTIONS

type IBlockchainActions = {
    [key in BLOCKCHAIN_ACTIONS]: (state: BlockchainState, payload: BlockchainPayload) => BlockchainState
}

const blockchainActions: IBlockchainActions = {
    [NOOP]: (state, _) => state,
    [SET_CONFIRMATIONS]: (state, payload: ConfirmationsPayload) => {
        const { confirmations } = state
        return {
            ...state,
            confirmations: {
                ...confirmations,
                ...payload
            }
        }
    },
    [CONNECT_CONFIRMATIONS]: (state, payload: ConnectionPayload) => {
        const { isConnected } = payload

        return {
            ...state,
            confirmations: {
                isConnected,
                currentCt: 0,
                totalCt: 0,
            }
        }
    },
}

// TODO: Extract reusable
const blockchainReducer = (state = initialState, action: BlockchainAction) => {
    const { type, payload } = action
    const userAction = blockchainActions[type]

    // if (userAction)
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
