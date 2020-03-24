import { getItem, addItem, updateItem } from 'api/rif-marketplace-cache/cacheController';
import { APP_ACTIONS } from 'store/App/appActions';
import { MarketItem } from 'models/Market';
import { ItemPayload } from './marketActions';

export const getMarketItem = async (
    itemPayload: ItemPayload,
    dispatch: any,
) => {
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

export const addMarketItem = async (
  itemPayload: ItemPayload,
  dispatch: any,
) => {
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

export const updateMarketItem = async (
  itemPayload: ItemPayload,
  dispatch: any,
) => {
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