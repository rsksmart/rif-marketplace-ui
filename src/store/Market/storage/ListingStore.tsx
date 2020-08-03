import React, { useReducer } from 'react'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { ListingState, StorageListingStoreProps, TimePeriodEnum } from './interfaces'
import { listingActions, ListingReducer } from './listingReducer'

export type StoreName = 'storage_listing'

const periodOptions: TimePeriodEnum[] = [TimePeriodEnum.Daily, TimePeriodEnum.Weekly, TimePeriodEnum.Monthly]

export const initialState: ListingState = {
  storeID: 'storage_listing',
  system: 'IPFS',
  availableSize: 1,
  country: '',
  currency: 'RBTC',
  planItems: [],
  internalCounter: 1,
  availablePeriods: periodOptions,
  allPeriods: periodOptions,
}

const StorageListingStore = React.createContext({} as StorageListingStoreProps | any)
const listingReducer: ListingReducer | StoreReducer = storeReducerFactory(initialState, listingActions as unknown as StoreActions)

export const StorageListingStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  const value = { state, dispatch }

  return <StorageListingStore.Provider value={value}>{children}</StorageListingStore.Provider>
}

export default StorageListingStore
