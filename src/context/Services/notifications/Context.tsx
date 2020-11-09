import React, {
  createContext,
  FC, useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import { mapFromTransport, serviceAddress } from 'api/rif-marketplace-cache/notifications'
import { createReducer } from 'context/storeUtils/reducer'
import { Transport as NotificationsTransport } from 'api/rif-marketplace-cache/notifications/interfaces'
import createWithContext from 'context/storeUtils/createWithContext'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { Props, State } from './interfaces'
import actions from './actions'

export const initialState: State = {
  contextID: serviceAddress,
  notifications: [],
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const {
    state: {
      apis: {
        notification: {
          service,
          fetch,
          attachEvent,
          connect,
        },
      },
    }, dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const [isInitialised, setIsInitialised] = useState(false)
  const errorReporter = errorReporterFactory(appDispatch)
  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const onEvent = (transport: NotificationsTransport): void => {
    dispatch({
      type: 'SET_NOTIFICATIONS',
      payload: mapFromTransport(transport),
    })
  }

  // Get service connection
  if (!service) {
    connect(errorReporter)
  }

  // Initialise
  useEffect(() => {
    if (service && !isInitialised) {
      try {
        // Set up WS events here
        attachEvent('updated', onEvent)
        attachEvent('patched', onEvent)
        attachEvent('created', onEvent)
        attachEvent('removed', onEvent)
        setIsInitialised(true)
      } catch (e) {
        errorReporter({
          error: e,
          id: 'service-connection',
          text: 'Error while initialising notifications service.',
        })
        setIsInitialised(false)
      }
    }
  }, [service, attachEvent, errorReporter, isInitialised, dispatch])

  // Fetch data
  useEffect(() => {
    if (isInitialised) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'data',
        },
      })
      fetch()
        .then((items) => {
          dispatch({
            type: 'SET_NOTIFICATIONS',
            payload: items,
          })
        })
        .finally(() => {
          appDispatch({
            type: 'SET_IS_LOADING',
            payload: {
              isLoading: false,
              id: 'data',
            },
          })
        })
    }
  }, [isInitialised, fetch, appDispatch])

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

export default createWithContext(Provider)
