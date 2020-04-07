import { MarketFilterIface } from 'models/Market';
import React, { Dispatch, useContext } from 'react';
import Middleware from 'store/storeUtils/middleware';
import { ItemPayload, MarketAction } from './marketActions';
import marketReducer from './marketReducer';
import { DomainItemIface } from 'models/marketItems/DomainItem';
import { StorageItemIface } from 'models/marketItems/StorageItem';
import { DomainsFilterIface } from 'api/models/RnsFilter';


export interface IMarketState {
  listings: {
    domainListing: DomainItemIface[];
    storageListing: StorageItemIface[];
  };
  filters: {
    domainListing: DomainsFilterIface,
    storageListing?: MarketFilterIface,
  }
  metadata: {
    domainListing: {
      lastUpdated: number;
    };
    storageListing: {
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
  filters: {
    domainListing: {
      price: {
        $lte: 9999,
        $gte: 0
      },
      sellerDomain: {
        $like: ''
      }
    },
  },
  metadata: {
    domainListing: {
      lastUpdated: -1,
    },
    storageListing: {
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
