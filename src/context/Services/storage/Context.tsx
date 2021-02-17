import { Web3Store } from '@rsksmart/rif-ui'
import AppContext, {
  AppContextProps,
  errorReporterFactory,
} from 'context/App/'

import createReducer from 'context/storeUtils/reducer'
import { StorageContract } from 'contracts/storage'
import { UIError } from 'models/UIMessage'
import React, {
  createContext,
  FC,
  useCallback, useContext, useEffect, useReducer,
} from 'react'
import Web3 from 'web3'
import actions from './actions'
import { Props, State } from './interfaces'

export const contextID = 'storage_global' as const
export type ContextName = typeof contextID

export const initialState: State = {
  contextID,
  isWhitelistedProvider: undefined,
  // contract: in a future refactor it would be good to have the instance
  // of the StorageManager contract here
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

const Provider: FC = ({ children }) => {
  const {
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )

  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  useEffect(() => {
    if (web3 && account) {
      const isWhitelisted = async (): Promise<void> => {
        try {
          const storageContract = StorageContract.getInstance(web3 as Web3)
          const isWhitelistedProvider = Boolean(await storageContract
            .isWhitelistedProvider(account))

          dispatch({
            type: 'SET_IS_WHITELISTED_PROVIDER',
            payload: { isWhitelistedProvider },
          })
        } catch (error) {
          reportError(new UIError({
            error: new Error('Could not determine if the account is a whitelisted provider.'),
            id: 'contract-storage',
            text: 'Could not determine whitelisted account.',
          }))
        }
      }
      isWhitelisted()
    }
  }, [web3, account, reportError])

  const value = { state, dispatch }
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default Provider
