import Logger from 'utils/Logger';
import {
  MARKET_ACTIONS,
  MarketAction,
  MarketPayload,
  ListingPayload,
  ItemPayload,
  FilterPayload,
} from './marketActions'
import { initialState, IMarketState, TxType } from './MarketStore'

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
  SET_ITEMS,
  SET_BUY_ITEM,
  SET_FILTER,
  TOGGLE_TX_TYPE,
} = MARKET_ACTIONS

const marketActions: IMarketActions = {
  [NOOP]: (state: IMarketState, _: MarketPayload) => state,
  [SET_ITEMS]: (state: IMarketState, payload: ListingPayload) => {
    const { listingType, items } = payload;

    const newState = { ...state }
    newState.listings[listingType] = items
    newState.metadata[listingType] = {
      ...newState.metadata[listingType],
      lastUpdated: Date.now()
    }

    return newState;
  },
  [SET_BUY_ITEM]: (state: IMarketState, payload: ItemPayload) => ({
    ...state, currentOrder: { ...payload }
  }),
  [SET_FILTER]: (state: IMarketState, payload: FilterPayload) => {
    const { filters } = state;
    const { listingType, filterItems } = payload;

    return {
      ...state,
      filters: {
        ...filters,
        [listingType]: {
          ...filters[listingType],
          ...filterItems
        }
      }
    };
  },
  [TOGGLE_TX_TYPE]: (state: IMarketState, _: MarketPayload) => {
    return {
      ...state,
      currentOrder: {
        txType: state.currentOrder.txType === TxType.BUY ? TxType.LIST : TxType.BUY,
      }
    }
  }
}

