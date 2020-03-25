import { getItem, addItem, updateItem, fetchMarketDataFor } from 'api/rif-marketplace-cache/cacheController';
import { APP_ACTIONS } from 'store/App/appActions';
import { MarketItem, MarketListingType, MarketItemType } from 'models/Market';
import { ItemPayload } from './marketActions';


const getMarketItem = (dispatch) => async (
    itemPayload: ItemPayload,
): Promise<{
  marketItem: MarketItem | undefined,
  error: Error | undefined
}> => {
  let marketItem: MarketItem | undefined;
  let error: Error | undefined;

  const { item: {
    _id
  },
    listingType
  } = itemPayload;

  dispatch({
  type: APP_ACTIONS.SET_IS_LOADING,
  payload: { isLoading: true, message: `Getting item id ${_id}` },
  })
  try {
    marketItem = await getItem(_id, listingType)
      
  } catch (err) {
    error = err
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
  return {marketItem, error}
}

const addMarketItem = (dispatch) => async (
  itemPayload: ItemPayload,
): Promise<{
  marketItem: MarketItem | undefined,
  error: Error | undefined
}> => {
  let marketItem: MarketItem | undefined;
  let error: Error | undefined;
  const { item,
    listingType
  } = itemPayload;

  dispatch({
  type: APP_ACTIONS.SET_IS_LOADING,
  payload: { isLoading: true, message: `Adding item id ${item._id}` },
  })

  try {
    await addItem(item, listingType)
  } catch (err) {
    error = err
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
  return {marketItem, error}
}

const updateMarketItem = (dispatch) => async (
  itemPayload: ItemPayload,
): Promise<{
  marketItem: MarketItem | undefined,
  error: Error | undefined
}> => {
  let marketItem: MarketItem | undefined;
  let error: Error | undefined;
  const { item,
    listingType
  } = itemPayload;

  dispatch({
  type: APP_ACTIONS.SET_IS_LOADING,
  payload: { isLoading: true, message: `Updating item id ${item._id}` },
  })

  try {
    await updateItem(item._id, item, listingType)
  } catch (err) {
    error = err
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
  return {marketItem, error}
}

const fetchListingItems = (dispatch) => async (
  listingType: MarketListingType,
): Promise<{
  marketItems: MarketItemType[] | undefined,
  error: Error | undefined
}> => {
  let marketItems: MarketItemType[] | undefined;
  let error: Error | undefined;

  dispatch({
    type: APP_ACTIONS.SET_IS_LOADING,
    payload: { isLoading: true, message: `Fetching ${listingType} from cache.` },
  })

  try {
    marketItems = await fetchMarketDataFor(listingType)
  } catch (err) {
    error = err
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
  return {marketItems, error}
}

export const useMarketUtils = (dispatch) => ({
  getMarketItem: getMarketItem(dispatch),
  addMarketItem: addMarketItem(dispatch),
  updateMarketItem: updateMarketItem(dispatch),
  fetchListingItems: fetchListingItems(dispatch)
})