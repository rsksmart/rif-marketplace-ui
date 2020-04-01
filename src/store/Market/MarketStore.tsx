import React, { Dispatch, useContext } from 'react';

import Middleware from 'store/storeUtils/middleware';
import { MarketAction, ItemPayload } from './marketActions';
import marketReducer from './marketReducer';
import { MarketItemType, MarketListingType, MarketItem } from 'models/Market';

export interface IMarketState {
  listings: {
    domainListing: MarketItemType[];
    storageListing: MarketItemType[];
  };
  metadata: {
    domain: {
      lastUpdated: number;
    };
    storage: {
      lastUpdated: number;
    };
  };
  currentOrder?: ItemPayload
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
  metadata: {
    domain: {
      lastUpdated: -1,
    },
    storage: {
      lastUpdated: -1,
    },
  },
};

export const useMarketContext = () => useContext(MarketStore);

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
