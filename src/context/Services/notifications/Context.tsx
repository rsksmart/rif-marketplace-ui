import React, {
  createContext,
  FC, useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import { serviceAddress } from 'api/rif-marketplace-cache/notifications'
import { createReducer } from 'context/storeUtils/reducer'
import { NotificationPayload } from 'api/rif-marketplace-cache/notifications/interfaces'
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

  const onEvent = (payload: NotificationPayload): void => {
    dispatch({
      type: 'SET_NOTIFICATIONS',
      payload,
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
