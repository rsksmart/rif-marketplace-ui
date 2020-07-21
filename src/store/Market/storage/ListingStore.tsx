import React, { useReducer } from 'react'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { ListingState, StorageListingStoreProps } from './interfaces'
import { listingActions, ListingReducer } from './listingReducer'

export type StoreName = 'storage_listing'

const monthsOptions = [1, 2, 3]
export const initialState: ListingState = {
  storeID: 'storage_listing',
  system: 'IPFS',
  availableSize: 1,
  country: '',
  currency: 'RIF',
  planItems: [],
  internalCounter: 1,
  availableMonths: monthsOptions,
  allMonthsOptions: monthsOptions,
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

const StorageListingStore = React.createContext({} as StorageListingStoreProps | any)
const listingReducer: ListingReducer | StoreReducer = storeReducerFactory(initialState, listingActions as unknown as StoreActions)

export const StorageListingStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  const value = { state, dispatch }

  return <StorageListingStore.Provider value={value}>{children}</StorageListingStore.Provider>
}

export default StorageListingStore
