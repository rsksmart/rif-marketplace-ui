import Logger from 'utils/Logger'
import {
  ConnectionPayload,
  FilterPayload,
  ItemPayload,
  ListingPayload,
  MarketAction,
  MarketPayloadType,
  MARKET_ACTIONS,
  TxTypeChangePayload,
  ExchangeRatePayload,
  MetadataPayload,
} from './marketActions'
import { MarketStateType, initialState } from './MarketStore'

const logger = Logger.getInstance()


const {
  NOOP,
  SET_ITEMS,
  SELECT_ITEM,
  SET_FILTER,
  TOGGLE_TX_TYPE,
  CONNECT_SERVICE,
  SET_EXCHANGE_RATE,
  CLEAN_UP,
  SET_META,
} = MARKET_ACTIONS

const marketActions: MarketActionsType = {
  [NOOP]: (state: MarketStateType, _: MarketPayloadType) => state,
  [SET_ITEMS]: (state: MarketStateType, payload: ListingPayload) => {
    const { currentListing, metadata } = state
    const listingType = currentListing?.listingType

    if (!currentListing) return state

    if (!listingType) return state

    const newState = {
      ...state,
      currentListing: {
        ...currentListing,
        ...payload,
      },
      metadata: {
        ...metadata,
        [listingType]: {
          ...metadata[listingType],
          lastUpdated: Date.now(),
          updatedTokens: [],
        },
      },
    }
    return newState
  },
  [SELECT_ITEM]: (state: MarketStateType, payload: ItemPayload) => ({
    ...state, currentOrder: { ...payload },
  }),
  [SET_FILTER]: (state: MarketStateType, payload: FilterPayload) => {
    const { filters, currentListing } = state

    if (!currentListing) return state
    const { listingType } = currentListing
    const { filterItems } = payload

    return {
      ...state,
      filters: {
        ...filters,
        [listingType]: {
          ...filters[listingType],
          ...filterItems,
        },
      },
    }
  },
  [TOGGLE_TX_TYPE]: (state: MarketStateType, payload: TxTypeChangePayload) => {
    const { currentListing } = state
    const { txType } = payload

    if (!currentListing) return state
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
  [CONNECT_SERVICE]: (state: MarketStateType, payload: ConnectionPayload) => {
    const { servicePath, listingType, txType } = payload
    return {
      ...state,
      currentListing: {
        listingType,
        servicePath,
        items: [],
        txType,
      },
    }
  },
  [SET_EXCHANGE_RATE]: (state: MarketStateType, payload: ExchangeRatePayload) => ({
    ...state,
    exchangeRates: {
      ...state.exchangeRates,
      crypto: {
        ...state.exchangeRates.crypto,
        ...payload,
      },
    },
  }),
  [CLEAN_UP]: (state: MarketStateType, _: MarketPayloadType) => ({
    ...state,
    currentListing: undefined,
    currentOrder: undefined,
  }),
  [SET_META]: (state: MarketStateType, payload: MetadataPayload) => {
    const { currentListing, metadata } = state
    const listingType = currentListing?.listingType as string

    if (!(currentListing && listingType)) return state

    const updateTokens = [
      ...metadata[listingType].updatedTokens,
      ...[payload.updatedTokenId],
    ]
    const tokensSet: Set<string> = new Set(updateTokens)

    return listingType ? {
      ...state,
      metadata: {
        ...metadata,
        [listingType]: {
          ...metadata[listingType],
          updatedTokens: Array.from(tokensSet),
        },
      },
    } : state
  },
}


// TODO: Extract reusable
const marketReducer = (state = initialState, action: MarketAction) => {
  const { type, payload } = action
  const marketAction = marketActions[type]

  // if (marketAction)
  logger.debug('Market action:', action)
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

type MarketActionsType = {
  [key in MARKET_ACTIONS]: (state: MarketStateType, payload: MarketPayloadType) => MarketStateType
}
