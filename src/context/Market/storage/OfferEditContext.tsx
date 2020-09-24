import React, { useReducer } from 'react'
import { ContextActions, ContextReducer } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { OfferEditState, OfferEditContextProps, TimePeriodEnum } from './interfaces'
import { offerEditActions, OfferEditReducer } from './offerEditReducer'
import { OfferEditPayload } from './offerEditActions'

export type ContextName = 'storage_offer_edit'

const periodOptions: TimePeriodEnum[] = [TimePeriodEnum.Daily, TimePeriodEnum.Weekly, TimePeriodEnum.Monthly]

export const initialState: OfferEditState = {
  contextID: 'storage_offer_edit',
  system: 'IPFS',
  availableSize: 1,
  country: '',
  planItems: [],
  internalCounter: 1,
  allPeriods: periodOptions,
  peerId: '',
  usedPeriodsPerCurrency: {},
}

const OfferEditContext = React.createContext({} as OfferEditContextProps | any)
const offerEditReducer: OfferEditReducer<OfferEditPayload> | ContextReducer = storeReducerFactory(initialState, offerEditActions as unknown as ContextActions)

export const OfferEditContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(offerEditReducer, initialState)

  const value = { state, dispatch }

  return <OfferEditContext.Provider value={value}>{children}</OfferEditContext.Provider>
}

export default OfferEditContext
