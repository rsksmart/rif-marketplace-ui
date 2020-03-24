import Logger from 'utils/Logger';
import {
  MARKET_ACTIONS,
  MarketAction,
  MarketPayload,
  ItemPayload,
} from './marketActions'
import { initialState, IMarketState } from './MarketStore'

const logger = Logger.getInstance()

const marketReducer = (state = initialState, action: MarketAction) => {
  const { type, payload } = action
  // const marketAction = marketActions[type]
  // if (!!marketAction) logger.debug('marketReducer -> action', action)
  // const newState = (!!marketAction && marketAction(state, payload)) || state

  // return newState
}
export default marketReducer

type IMarketActions = {
  [key in MARKET_ACTIONS]: (state: IMarketState, payload: MarketPayload) => IMarketState
}

const {
  NOOP,
  GET_ITEM,
} = MARKET_ACTIONS

// const marketActions: IMarketActions = {
//   [NOOP]: (state: IMarketState, _: MarketPayload) => state,
//   // [SET_ITEM]: (state: IMarketState, payload: ItemPayload) => {
//   //   const newState = state;
//   //   const { listingType, item } = payload;
//   //   const { listings } = state;
//   //   const newListing = {
//   //     ...listings,
//   //     [listingType]: 
//   //   }
//   //   return {marketItem};
//   // },
//   [ADD_ITEM]: (state: IMarketState, payload: ItemPayload) => {
//   }
// }

