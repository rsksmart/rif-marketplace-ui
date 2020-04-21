import { MarketFilter, MarketItemType, MarketListingTypes } from 'models/Market';
import { Dispatch } from 'react';
import { AppAction, APP_ACTIONS } from 'store/App/appActions';

const dispatchFetchData = (dispatch: Dispatch<AppAction>) => async (
  fetchFunction: () => {}
): Promise<MarketItemType[]> => {
  let marketItems: MarketItemType[] = [];

  dispatch({
    type: APP_ACTIONS.SET_IS_LOADING,
    payload: { isLoading: true, message: `Fetching data from the cache server.` },
  })

  try {
    // marketItems = fetchFunction()
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
  fetchListingItems: dispatchFetchData(dispatch),
})