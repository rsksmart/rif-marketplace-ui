import Logger from 'utils/Logger';
import { ConnectionPayload, FilterPayload, ItemPayload, ListingPayload, MarketAction, MarketPayload, MARKET_ACTIONS } from './marketActions';
import { IMarketState, initialState, TxType } from './MarketStore';

const logger = Logger.getInstance()

// TODO: Extract reusable
const marketReducer = (state = initialState, action: MarketAction) => {
  const { type, payload } = action
  const marketAction = marketActions[type]
  if (!!marketAction) logger.debug('Market action:', action)
  const newState = (!!marketAction && marketAction(state, payload)) || state

  if (state !== newState) {
    logger.debug('Prev state:', state)
    logger.debug('Next state:', newState)
  } else {
    logger.debug('No change:', newState)
  }

  return newState
}
export default marketReducer

type IMarketActions = {
  [key in MARKET_ACTIONS]: (state: IMarketState, payload: MarketPayload) => IMarketState
}

const {
  NOOP,
  SET_ITEMS,
  SELECT_ITEM,
  SET_FILTER,
  TOGGLE_TX_TYPE,
  CONNECT_SERVICE,
} = MARKET_ACTIONS

const marketActions: IMarketActions = {
  [NOOP]: (state: IMarketState, _: MarketPayload) => state,
  [SET_ITEMS]: (state: IMarketState, payload: ListingPayload) => {
    const { listingType, items } = payload;
    if (listingType !== state.currentListing?.listingType)
      logger.error('There is a mismatch of types in the current items (market store)!');
    const newState = {
      ...state,
      currentListing: {
        ...state.currentListing,
        items,
      },
      metadata: {
        ...state.metadata,
        [listingType]: {
          ...state.metadata[listingType],
          lastUpdated: Date.now()
        },
      }
    }
    return newState;
  },
  [SELECT_ITEM]: (state: IMarketState, payload: ItemPayload) => ({
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
    const { currentListing: { txType: currentTxType } } = state;
    const txType = currentTxType === TxType.BUY ? TxType.SELL : TxType.BUY;
    return {
      ...state,
      currentListing: {
        txType,
        items: [],
      },
    }
  },
  [CONNECT_SERVICE]: (state: IMarketState, payload: ConnectionPayload) => {
    const { servicePath, listingType } = payload;
    return {
      ...state,
      currentListing: {
        listingType,
        servicePath,
        items: []
      }
    }
  }
}

