import React, { useReducer } from 'react'
import { ContextActions, ContextReducer } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { StorageSellState, StorageSellContextProps, TimePeriodEnum } from './interfaces'
import { storageSellActions, StorageSellReducer } from './storageSellReducer'
import { StorageSellPayload } from './storageSellActions'

export type ContextName = 'storage_sell'

const periodOptions: TimePeriodEnum[] = [TimePeriodEnum.Daily, TimePeriodEnum.Weekly, TimePeriodEnum.Monthly]

export const initialState: StorageSellState = {
  contextID: 'storage_sell',
  system: 'IPFS',
  availableSize: 1,
  country: '',
  planItems: [],
  internalCounter: 1,
  allPeriods: periodOptions,
  peerId: '',
  usedPeriodsPerCurrency: {},
}

const StorageSellContext = React.createContext({} as StorageSellContextProps | any)
const listingReducer: StorageSellReducer<StorageSellPayload> | ContextReducer = storeReducerFactory(initialState, storageSellActions as unknown as ContextActions)

export const StorageSellContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  const value = { state, dispatch }

  return <StorageSellContext.Provider value={value}>{children}</StorageSellContext.Provider>
}

export default StorageSellContext
