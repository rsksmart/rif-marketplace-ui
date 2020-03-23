import React, { Dispatch } from 'react';

import Middleware from 'store/storeUtils/middleware';
import { MarketAction } from './marketActions';
import marketReducer from './marketReducer';
import { MarketItemType } from 'models/Market';

export interface IMarketState {
  // TODO: Extract Listings
  listings: {
    domainListing: MarketItemType[];
    storageListing: MarketItemType[];
  };
}

interface IMarketStoreProps {
  state: IMarketState;
  dispatch: Dispatch<MarketAction>;
}

export const initialState: IMarketState = {
  listings: {
    domainListing: [],
    storageListing: [],
  },
};

const MarketStore = React.createContext({} as IMarketStoreProps | any);

export const MarketStoreProvider = ({ children }) => {
  const { useMiddleware } = Middleware.getInstance();

  const [state, dispatch] = useMiddleware(
    'MarketState',
    marketReducer,
    initialState,
  );

  const value = { state, dispatch };
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>;
};

export default MarketStore;
