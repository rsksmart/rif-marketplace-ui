import React, { FC, useReducer } from 'react'
import Big from 'big.js'
import { ContextActions, ContextReducer } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { useLocation } from 'react-router-dom'
import { getURLParamByName, isEmpty } from 'utils/stringUtils'
import { OfferEditState, OfferEditContextProps } from './interfaces'
import { offerEditActions, OfferEditReducer } from './offerEditReducer'
import { OfferEditPayload } from './offerEditActions'

export type ContextName = 'storage_offer_edit'

const billingPeriods: SubscriptionPeriod[] = ['Daily', 'Weekly', 'Monthly']

export const initialState: OfferEditState = {
  contextID: 'storage_offer_edit',
  system: 'IPFS',
  totalCapacity: new Big(1),
  country: '',
  internalCounter: 1,
  peerId: '',
  usedPeriodsPerCurrency: {},
  billingPlans: [],
  allBillingPeriods: billingPeriods,
  originalOffer: undefined,
}

const OfferEditContext = React.createContext({} as OfferEditContextProps | any)
const offerEditReducer: OfferEditReducer<OfferEditPayload> | ContextReducer = storeReducerFactory(initialState, offerEditActions as unknown as ContextActions)

export const OfferEditContextProvider: FC = ({ children }) => {
  const { search } = useLocation()

  if (!isEmpty(search)) {
    initialState.peerId = getURLParamByName(search, 'peerId') ?? initialState.peerId
  }

  const [state, dispatch] = useReducer(offerEditReducer, initialState)

  const value = { state, dispatch }

  return <OfferEditContext.Provider value={value}>{children}</OfferEditContext.Provider>
}

export default OfferEditContext
