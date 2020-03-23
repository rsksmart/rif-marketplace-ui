import LocalStorage from 'utils/LocalStorage';
import Logger from 'utils/Logger';
import {
  MARKET_ACTIONS,
  MarketAction,
  MarketPayload,
  ItemPayload,
  FilterPayload,
} from './marketActions'
import { initialState, IMarketState } from './MarketStore'

const persistence = LocalStorage.getInstance()
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
  GET_ITEM,
  FILTER_ITEMS
} = MARKET_ACTIONS

const marketActions: IMarketActions = {
  [NOOP]: (state: IMarketState, _: MarketPayload) => state,
  [GET_ITEM]: (state: IMarketState, payload: ItemPayload) => {
    const newState = state;
    // const { itemType, item_id } = payload;
    return newState;
  },
  [FILTER_ITEMS]: (state: IMarketState, payload: FilterPayload) => {
    const { filterType, filterData } = payload;
    const {filterParam, itemType } = filterData;

    const itemCollection = persistence.getItem(itemType);
    const filteredItems = filterType(filterParam, itemCollection);
    return {
      ...state,
      filteredItems
    }
  }
}

