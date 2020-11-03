import React, {
  createContext,
  FC, useMemo, useReducer, useState,
} from 'react'
import { serviceAddress } from 'api/rif-marketplace-cache/notifications'
import { createReducer } from 'context/storeUtils/reducer'
import { Props, State } from './interfaces'
import actions from './actions'

export const initialState: State = {
  contextID: serviceAddress,
  notifications: new Set([]),
}

const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)
  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  // Finalise
  const value = useMemo(() => ({
    state,
    dispatch,
  }), [state])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default Context
