import React, { useReducer } from 'react'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { StorageState, StorageListingPlan, StorageStoreProps } from './interfaces'
import { StorageReducer, storageActions } from './storageReducer'

export type StoreName = 'storage_listing'

export type StorageListingState = Modify<StorageState, {
  plan: StorageListingPlan
}>

export const initialState: StorageListingState = {
  storeID: 'storage_listing',
  plan: {
    system: 'IPFS',
    availableSize: 1,
    country: '',
    currency: 'RIF',
    planItems: [],
    internalCounter: 1,
    availableMonths: [1, 2, 3],
    // TODO: now only 3 for testing
    // TODO: consider moving props to root and remove plan prop
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
}

const StorageListingStore = React.createContext({} as StorageStoreProps)
const listingReducer: StorageReducer | StoreReducer = storeReducerFactory(initialState, storageActions as unknown as StoreActions)

export const StorageListingStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  const value = { state, dispatch }

  return <StorageListingStore.Provider value={value}>{children}</StorageListingStore.Provider>
}

export default StorageListingStore
