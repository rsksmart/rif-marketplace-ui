import React, {
  createContext, FC, useContext, useMemo, useReducer,
} from 'react'
import { createReducer } from 'context/storeUtils/reducer'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { Props, State } from './interfaces'
import actions from './actions'

export const initialState: State = {
  contextID: 'storage_agreements',
  agreements: [],
}

const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const {
    state: {
      apis: {
        'storage/v0/agreements': api,
      },
    },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)

  if (api && !api.service) {
    api.connect(errorReporterFactory(appDispatch))
  }

  // Finalise
  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

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
