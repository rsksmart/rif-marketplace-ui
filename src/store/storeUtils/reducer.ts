import Logger from 'utils/Logger'
import { StoreDispatcher, StorePayload, StoreState, StoreActions, StoreAction, StoreReducer } from './interfaces'
const logger = Logger.getInstance()


const storeReducerFactory = (initialState: StoreState, actions: StoreActions, errorHandle = (e) => { }): StoreReducer =>
    (state = initialState, dispatcher: StoreDispatcher<StorePayload>) => {
        const { type, payload } = dispatcher
        const action: StoreAction = actions[type]

        logger.debug(`${initialState.storeID} action: ${action}`)
        try {
            const newState = (!!action && action(state, payload)) || state

            if (state !== newState) {
                logger.debug('Prev state:', state)
                logger.debug('Next state:', newState)
            } else {
                logger.debug('No change:', newState)
            }

            return newState
        } catch (e) {
            errorHandle(e)
            return state
        }
    }

export default storeReducerFactory