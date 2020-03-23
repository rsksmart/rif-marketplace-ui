import { getItem } from 'api/rif-marketplace-cache/cacheController';
import { APP_ACTIONS } from 'store/App/appActions';
import { MarketItem } from 'models/Market';

export const getMarketItem = async (
    item: {
        item_id: string,
        itemType: string //TODO: make enum
    },
    dispatch: any,
) => {
  let marketItem: MarketItem | undefined;
  let error: Error | undefined;

  const { item_id, itemType } = item;

  dispatch({
  type: APP_ACTIONS.SET_IS_LOADING,
  payload: { isLoading: true, message: `Getting item id ${item_id}` },
  })
  try {
    marketItem = await getItem(item_id, itemType)
      
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