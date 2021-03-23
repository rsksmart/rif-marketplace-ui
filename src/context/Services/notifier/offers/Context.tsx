import React, {
  createContext, FC, useContext, useEffect, useReducer, useState,
} from 'react'
import createWithContext from 'context/storeUtils/createWithContext'
import createReducer from 'context/storeUtils/reducer'

import AppContext, { AppContextProps } from 'context/App'
import useErrorReporter from 'hooks/useErrorReporter'
import { NotifierOffersService } from 'api/rif-marketplace-cache/notifier'
import { UIError } from 'models/UIMessage'
import { notifierOffersAddress } from 'api/rif-marketplace-cache/notifier/offers'
import { State, Props } from './interfaces'
import actions from './actions'

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
  const [isInitialised, setIsInitialised] = useState(false)

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const {
    state: appState,
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const api: NotifierOffersService = appState.apis[
    notifierOffersAddress] as NotifierOffersService

  const reportError = useErrorReporter()

  // Initialise
  if (!api.service) {
    api.connect(reportError)
  }

  useEffect(() => {
    if (api?.service && !isInitialised) {
      try {
        setIsInitialised(true)
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised])

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
      api.fetch()
        .then((items) => {
          dispatch({
            type: 'SET_LISTING',
            payload: { items },
          })
        })
        .catch((error) => {
          reportError(new UIError({
            error,
            id: 'service-fetch',
            text: 'Notifier API Error while fetching data.',
          }))
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
  }, [
    appDispatch,
    isInitialised,
    api,
    reportError,
  ])

  const value = { state, dispatch }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default createWithContext(Provider)
