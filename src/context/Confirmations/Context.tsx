import { Web3Store } from '@rsksmart/rif-ui'
import {
  ConfirmationsService,
  Transport as ConfirmationTransport,
} from 'api/rif-marketplace-cache/blockchain/confirmations'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { createReducer } from 'context/storeUtils/reducer'
import React, {
  createContext, FC, useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import actions from './actions'
import { Props, State } from './interfaces'

export const contextID = 'confirmations' as const
export type ContextName = typeof contextID

export const initialState: State = {
  contextID,
  confirmations: {},
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const {
    state: {
      apis: {
        confirmations: confirmationsApi,
      },
    },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)

  const {
    service,
    connect,
    attachEvent,
    authenticate,
  } = confirmationsApi as ConfirmationsService

  const {
    state: { account },
  } = useContext(Web3Store)

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const errorReporter = errorReporterFactory(appDispatch)
  const [isInitialised, setIsInitialised] = useState(false)

  // Get service connection
  if (!service) {
    connect(errorReporter)
  }

  // Initialise
  useEffect(() => {
    if (service && !isInitialised && account) {
      const initialise = async (): Promise<void> => {
        try {
          await authenticate(account)
          attachEvent('newConfirmation', (confirmation: ConfirmationTransport): void => {
            dispatch({
              type: 'NEW_CONFIRMATION',
              payload: confirmation,
            })
          })
          setIsInitialised(true)
        } catch (e) {
          errorReporter({
            error: e,
            id: 'service-connection',
            text: 'Error while initialising confirmations service.',
          })
        }
      }

      initialise()
    }
  }, [
    service,
    authenticate,
    attachEvent,
    errorReporter,
    isInitialised,
    dispatch,
    account,
  ])

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
