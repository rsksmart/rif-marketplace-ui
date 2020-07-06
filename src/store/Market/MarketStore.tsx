import React, { Dispatch, useReducer } from 'react'
import { StoreReducer, StoreActions, StoreState } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { MarketAction } from './marketActions'
import { MarketReducer, marketActions } from './marketReducer'

export type StoreName = 'market'

export enum TxType {
  BUY = 0,
  SELL = 1
}

export interface MarketState extends StoreState {
  txType: TxType
  exchangeRates: {
    currentFiat: {
      symbol: string
      displayName: string
    }
    crypto: {
      rif: {
        displayName: string
        rate?: number
      }
    }
  }
}

interface MarketStoreProps {
  state: MarketState
  dispatch: Dispatch<MarketAction>
}

export const initialState: MarketState = {
  storeID: 'market',
  txType: TxType.BUY,
  exchangeRates: {
    currentFiat: {
      symbol: 'usd',
      displayName: 'USD',
    },
    crypto: {
      rif: {
        displayName: 'RIF',
      },
    },
  },
}

const MarketStore = React.createContext({} as MarketStoreProps | any)
const marketReducer: MarketReducer | StoreReducer = storeReducerFactory(initialState, marketActions as unknown as StoreActions)

export const MarketStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(marketReducer, initialState)

  const value = { state, dispatch }
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>
}

export default MarketStore
