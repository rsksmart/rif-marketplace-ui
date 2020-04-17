import { DomainFilter, DomainOffersFilter } from 'api/models/RnsFilter';
import { MarketItemIface, MarketItemType, MarketListingTypes } from 'models/Market';
import React, { Dispatch, useReducer } from 'react';
import { MarketAction } from './marketActions';
import marketReducer from './marketReducer';

export enum TxType {
  SELL = 1,
  BUY = 0,
}
export interface ICurrentOrder {
  listingType: MarketListingTypes;
  item: MarketItemIface;
  txType: TxType;
  isProcessing: boolean;
}

export interface IMarketState {
  currentListing?: {
    servicePath: string,
    listingType: MarketListingTypes;
    txType: TxType;
    items: MarketItemType[],
  }
  filters: {
    domains: DomainFilter,
    domainOffers: DomainOffersFilter,
  };
  metadata: {
    domains: {
      lastUpdated: number;
    };
    domainOffers: {
      lastUpdated: number;
    }
    storage: {
      lastUpdated: number;
    };
  };
  currentOrder?: ICurrentOrder;
}

interface IMarketStoreProps {
  state: IMarketState;
  dispatch: Dispatch<MarketAction>;
}

export const initialState: IMarketState = {
  filters: {
    domains: {

    },
    domainOffers: {
      price: {
        $lte: 100,
        $gte: 0
      },
    },
  },
  metadata: {
    domains: {
      lastUpdated: -1,
    },
    domainOffers: {
      lastUpdated: -1,
    },
    storage: {
      lastUpdated: -1,
    },
  }
};

const MarketStore = React.createContext({} as IMarketStoreProps | any);

export const MarketStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(marketReducer, initialState);

  const value = { state, dispatch };
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>;
};

export default MarketStore;
