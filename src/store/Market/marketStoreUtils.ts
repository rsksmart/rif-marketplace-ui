import { fetchMarketDataFor } from 'api/rif-marketplace-cache/cacheController';
import { MarketItemType, MarketListingTypes, MarketFilterIface } from 'models/Market';
import { APP_ACTIONS } from 'store/App/appActions';


const fetchListingItems = (dispatch) => async (
  listingType: MarketListingTypes,
  filters?: MarketFilterIface,
): Promise<MarketItemType[]> => {
  let marketItems: MarketItemType[] = [];

  dispatch({
    type: APP_ACTIONS.SET_IS_LOADING,
    payload: { isLoading: true, message: `Fetching ${listingType} from the cache server.` },
  })

  try {
    marketItems = await fetchMarketDataFor(listingType, filters);
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

export const useMarketUtils = (dispatch) => ({
  fetchListingItems: fetchListingItems(dispatch),
})