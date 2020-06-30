import React, { Dispatch, useReducer } from 'react'
import { MarketAction } from './marketActions'
import marketReducer from './marketReducer'

export enum TxType {
  BUY = 0,
  SELL = 1
}

export interface MarketStateType {
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

interface MarketStorePropsType {
  state: MarketStateType
  dispatch: Dispatch<MarketAction>
}

export const initialState: MarketStateType = {
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

const MarketStore = React.createContext({} as MarketStorePropsType | any)

export const MarketStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(marketReducer, initialState)

  const value = { state, dispatch }
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>
}

export default MarketStore
