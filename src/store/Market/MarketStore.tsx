import { DomainsFilterIface } from 'api/models/RnsFilter';
import { MarketFilterIface, MarketItemIface, MarketListingTypes } from 'models/Market';
import { DomainItemIface } from 'models/marketItems/DomainItem';
import { StorageItemIface } from 'models/marketItems/StorageItem';
import React, { Dispatch, useReducer } from 'react';
import { MarketAction } from './marketActions';
import marketReducer from './marketReducer';

export enum TxType {
  BUY = 0,
  LIST = 1
}
export interface ICurrentOrder {
  listingType?: MarketListingTypes;
  item?: MarketItemIface;
  txType: TxType;
  isProcessing?: boolean;
}

export interface IMarketState {
  listings: {
    domains: DomainItemIface[];
    storage: StorageItemIface[];
  };
  filters: {
    domains: DomainsFilterIface,
    storage?: MarketFilterIface,
  };
  metadata: {
    domains: {
      lastUpdated: number;
    };
    storage: {
      lastUpdated: number;
    };
  };
  currentOrder: ICurrentOrder;
}

interface IMarketStoreProps {
  state: IMarketState;
  dispatch: Dispatch<MarketAction>;
}

export const initialState: IMarketState = {
  listings: {
    domains: [],
    storage: [],
  },
  filters: {
    domains: {
      price: {
        $lte: 100,
        $gte: 0
      },
      sellerDomain: {
        $like: ''
      }
    },
  },
  metadata: {
    domains: {
      lastUpdated: -1,
    },
    storage: {
      lastUpdated: -1,
    },
  },
  currentOrder: {
    txType: TxType.BUY,
  }
};

const MarketStore = React.createContext({} as IMarketStoreProps | any);

export const MarketStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(marketReducer, initialState);

  const value = { state, dispatch };
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>;
};

export default MarketStore;
