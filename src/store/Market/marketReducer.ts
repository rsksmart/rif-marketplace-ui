import Logger from 'utils/Logger'
import {
  MarketAction,
  MarketPayloadType,
  MARKET_ACTIONS,
  TxTypeChangePayload,
  ExchangeRatePayload,
} from './marketActions'
import { MarketStateType, initialState } from './MarketStore'

const logger = Logger.getInstance()

const {
  NOOP,
  TOGGLE_TX_TYPE,
  SET_EXCHANGE_RATE,
} = MARKET_ACTIONS

const marketActions: any = {
  [NOOP]: (state: MarketStateType, _: MarketPayloadType) => state,
  [TOGGLE_TX_TYPE]: (state: MarketStateType, payload: TxTypeChangePayload) => {
    // const { currentListing } = state
    // const { txType } = payload

    // if (!currentListing) return state
    return {
      ...state,
      // currentListing: {
      //   txType,
      //   items: [],
      //   servicePath: '',
      //   listingType: currentListing.listingType, // TODO: It would be better blank but that creates problems. This may be an issue also, though.
      // },
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
