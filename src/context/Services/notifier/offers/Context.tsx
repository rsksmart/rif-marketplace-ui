import React, { createContext, FC, useReducer } from 'react'
import createWithContext from 'context/storeUtils/createWithContext'
import createReducer from 'context/storeUtils/reducer'

import actions from './actions'
import { State, Props } from './interfaces'

export const contextName = 'notifier_offers' as const

export const initialState: State = {
  contextID: contextName,
  listing: {
    items: [],
  },
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const value = { state, dispatch }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default createWithContext(Provider)
