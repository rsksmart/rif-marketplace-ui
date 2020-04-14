import { DomainsFilterIface } from 'api/models/RnsFilter';
import { MarketFilterIface, MarketItemIface, MarketListingTypes } from 'models/Market';
import { DomainItemIface } from 'models/marketItems/DomainItem';
import { StorageItemIface } from 'models/marketItems/StorageItem';
import React, { Dispatch } from 'react';
import Middleware from 'store/storeUtils/middleware';
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
    domainListing: DomainItemIface[];
    storageListing: StorageItemIface[];
  };
  filters: {
    domainListing: DomainsFilterIface,
    storageListing?: MarketFilterIface,
  };
  metadata: {
    domainListing: {
      lastUpdated: number;
    };
    storageListing: {
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
    domainListing: [],
    storageListing: [],
  },
  filters: {
    domainListing: {
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
    domainListing: {
      lastUpdated: -1,
    },
    storageListing: {
      lastUpdated: -1,
    },
  },
  currentOrder: {
    txType: TxType.BUY,
  }
};

const MarketStore = React.createContext({} as IMarketStoreProps | any);

export const MarketStoreProvider = ({ children }) => {
  const { useMiddleware } = Middleware.getInstance();

  const [state, dispatch] = useMiddleware(marketReducer, initialState);

  const value = { state, dispatch };
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>;
};

export default MarketStore;
