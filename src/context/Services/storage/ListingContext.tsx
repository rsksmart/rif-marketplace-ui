import React, { useReducer } from 'react'
import { ContextActions, ContextReducer } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { ListingState, StorageListingContextProps, TimePeriodEnum } from './interfaces'
import { listingActions, ListingReducer } from './listingReducer'
import { ListingPayload } from '../rns/rnsActions'

export type ContextName = 'storage_listing'

const periodOptions: TimePeriodEnum[] = [TimePeriodEnum.Daily, TimePeriodEnum.Weekly, TimePeriodEnum.Monthly]

export const initialState: ListingState = {
  contextID: 'storage_listing',
  system: 'IPFS',
  availableSize: 1,
  country: '',
  planItems: [],
  internalCounter: 1,
  allPeriods: periodOptions,
  peerId: '',
  usedPeriodsPerCurrency: {},
}

const StorageListingContext = React.createContext({} as StorageListingContextProps | any)
const listingReducer: ListingReducer<ListingPayload> | ContextReducer = storeReducerFactory(initialState, listingActions as unknown as ContextActions)

export const StorageListingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  const value = { state, dispatch }

  return <StorageListingContext.Provider value={value}>{children}</StorageListingContext.Provider>
}

export default StorageListingContext
