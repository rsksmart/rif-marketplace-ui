import Big from 'big.js'
import createReducer from 'context/storeUtils/reducer'
import { SubscriptionPeriod } from 'models/marketItems/StorageItem'
import React, { createContext, FC, useReducer } from 'react'
import { useLocation } from 'react-router-dom'
import { getURLParamByName, isEmpty } from 'utils/stringUtils'
import actions from './actions'
import { contextID, Props, State } from './interfaces'

const billingPeriods: SubscriptionPeriod[] = ['Daily', 'Weekly', 'Monthly']

export const initialState: State = {
  contextID,
  system: 'IPFS',
  totalCapacity: new Big(1),
  country: '',
  internalCounter: 1,
  peerId: '',
  usedPeriodsPerCurrency: {},
  billingPlans: [],
  allBillingPeriods: billingPeriods,
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const { search } = useLocation()

  if (!isEmpty(search)) {
    initialState.peerId = getURLParamByName(search, 'peerId') ?? initialState.peerId
  }

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions), initialState,
  )

  const value = { state, dispatch }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default Context
