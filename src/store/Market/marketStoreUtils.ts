import { fetchMarketDataFor } from 'api/rif-marketplace-cache/cacheController';
import { MarketItemType, MarketListingTypes, MarketFilterIface } from 'models/Market';
import { APP_ACTIONS, AppAction } from 'store/App/appActions';
import { TxType } from './MarketStore';
import { Dispatch } from 'react';


const fetchListingItems = (dispatch: Dispatch<AppAction>) => async (
  listingType: MarketListingTypes,
  txType: TxType,
  filters?: MarketFilterIface,
): Promise<MarketItemType[]> => {
  let marketItems: MarketItemType[] = [];

  dispatch({
    type: APP_ACTIONS.SET_IS_LOADING,
    payload: { isLoading: true, message: `Fetching ${listingType} from the cache server.` },
  })

  try {
    marketItems = await fetchMarketDataFor(listingType, txType, filters);
  } catch (err) {
    const { message } = err
    dispatch({
      type: APP_ACTIONS.SET_MESSAGE, payload: {
        isError: true,
        message
      }
    })
  } finally {
    dispatch({
      type: APP_ACTIONS.SET_IS_LOADING,
      payload: { isLoading: false },
    })
  }
  return marketItems;
}

export const useMarketUtils = (dispatch: Dispatch<AppAction>) => ({
  fetchListingItems: fetchListingItems(dispatch),
})