import Logger from 'utils/Logger';
import {
  ConnectionPayload,
  FilterPayload,
  ItemPayload,
  ListingPayload,
  MarketAction,
  MarketPayload,
  MARKET_ACTIONS,
  TxTypeChangePayload,
  ExchangeRatePayload
} from './marketActions';
import { IMarketState, initialState } from './MarketStore';

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
  SET_EXCHANGE_RATE,
} = MARKET_ACTIONS

const marketActions: IMarketActions = {
  [NOOP]: (state: IMarketState, _: MarketPayload) => state,
  [SET_ITEMS]: (state: IMarketState, payload: ListingPayload) => {
    const { listingType, items } = payload;
    const { currentListing } = state;
    if (!currentListing) return state;
    if (listingType !== currentListing.listingType)
      logger.error('There is a mismatch of types in the current items (market store)!');
    const newState = {
      ...state,
      currentListing: {
        txType: currentListing.txType,
        listingType: listingType,
        servicePath: currentListing.servicePath,
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
    const { filters, currentListing } = state;
    if (!currentListing) return state;
    const { listingType } = currentListing;
    const { filterItems } = payload;

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
  [TOGGLE_TX_TYPE]: (state: IMarketState, payload: TxTypeChangePayload) => {
    const { currentListing } = state;
    const { txType } = payload;
    if (!currentListing) return state;
    return {
      ...state,
      currentListing: {
        txType,
        items: [],
        servicePath: '',
        listingType: currentListing.listingType, // TODO: It would be better blank but that creates problems. This may be an issue also, though.
      },
    }
  },
  [CONNECT_SERVICE]: (state: IMarketState, payload: ConnectionPayload) => {
    const { servicePath, listingType, txType } = payload;
    return {
      ...state,
      currentListing: {
        listingType,
        servicePath,
        items: [],
        txType,
      }
    }
  },
  [SET_EXCHANGE_RATE]: (state: IMarketState, payload: ExchangeRatePayload) => {
    return {
      ...state,
      exchangeRates: {
        ...state.exchangeRates,
        crypto: {
          ...state.exchangeRates.crypto,
          ...payload,
        }
      }
    }
  }
}

