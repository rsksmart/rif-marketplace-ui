import React, {
  createContext, FC, useContext,
  useEffect, useMemo, useReducer, useState,
} from 'react'
import { createReducer } from 'context/storeUtils/reducer'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { LoadingPayload } from 'context/App/appActions'
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

  const [isInitialised, setIsInitialised] = useState(false)
  const [needsRefresh, setNeedsRefresh] = useState(true)

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const { filters } = state as State

  // Get service connection
  if (api && !api.service) {
    api.connect(errorReporterFactory(appDispatch))
  }

  // Initialise
  useEffect(() => {
    if (api.service && !isInitialised) {
      try {
        // Set up WS events here
        const { attachEvent } = api
        attachEvent('updated', () => setNeedsRefresh(true))
        attachEvent('patched', () => setNeedsRefresh(true))
        attachEvent('created', () => setNeedsRefresh(true))
        attachEvent('removed', () => setNeedsRefresh(true))
        setIsInitialised(true)
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised, appDispatch])

  // Fetch data
  useEffect(() => {
    if (isInitialised && filters && needsRefresh) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'data',
        } as LoadingPayload,
      })
      api.fetch(filters)
        .then((items) => {
          dispatch({
            type: 'SET_LISTING',
            payload: items,
          })
          setNeedsRefresh(false)
        })
        .finally(() => {
          appDispatch({
            type: 'SET_IS_LOADING',
            payload: {
              isLoading: false,
              id: 'data',
            } as LoadingPayload,
          })
        })
    }
  }, [isInitialised, api, filters, appDispatch, needsRefresh])

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
