import Logger from 'utils/Logger';
import {
  MARKET_ACTIONS,
  MarketAction,
  MarketPayload,
  ListingPayload,
} from './marketActions'
import { initialState, IMarketState } from './MarketStore'

const logger = Logger.getInstance()

const marketReducer = (state = initialState, action: MarketAction) => {
  const { type, payload } = action
  const marketAction = marketActions[type]
  if (!!marketAction) logger.debug('marketReducer -> action', action)
  const newState = (!!marketAction && marketAction(state, payload)) || state

  return newState
}
export default marketReducer

type IMarketActions = {
  [key in MARKET_ACTIONS]: (state: IMarketState, payload: MarketPayload) => IMarketState
}

const {
  NOOP,
  SET_ITEMS
} = MARKET_ACTIONS

const marketActions: IMarketActions = {
  [NOOP]: (state: IMarketState, _: MarketPayload) => state,
  [SET_ITEMS]: (state: IMarketState, payload: ListingPayload) => {
    const { listingType, items } = payload;

    const newState = { ...state }
    newState.listings[listingType] = items
    newState.metadata.domain.lastUpdated = Date.now();

    return newState;
  }
}

