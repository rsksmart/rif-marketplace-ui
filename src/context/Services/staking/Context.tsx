import { Web3Store } from '@rsksmart/rif-ui'
import {
  onStakeUpdated, setStakeNeedsRefresh,
} from 'context/Services/staking/utils'
import actions from 'context/Services/staking/actions'
import AppContext, {
  AppContextProps,
  errorReporterFactory,
} from 'context/App'
import createReducer from 'context/storeUtils/reducer'
import { UIError } from 'models/UIMessage'
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  Props, State,
} from 'context/Services/staking/interfaces'
import {
  NotifierStakesAddress,
} from 'api/rif-marketplace-cache/notifier/stakes'
import { StorageStakesAddress } from 'api/rif-marketplace-cache/storage/stakes'
import {
  contextName,
} from './interfaces'

export const initialState: State = {
  contextID: contextName,
  needsRefresh: true,
  totalStakedUSD: '',
  stakes: {
    rbtc: '0',
    rif: '0',
  },
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

type StakesAddress = NotifierStakesAddress | StorageStakesAddress

export type ContextProviderProps = {
  apiAddress: StakesAddress
}

export const ContextProvider: FC<ContextProviderProps> = ({ apiAddress, children }) => {
  const {
    state: { apis },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e),
    [appDispatch],
  )
  const {
    state: { account },
  } = useContext(Web3Store)
  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )
  const { needsRefresh } = state

  const api = apis[
    apiAddress
  ]

  if (api && !api.service) {
    api.connect(errorReporterFactory(appDispatch))
  }

  const [isInitialised, setIsInitialised] = useState(false)

  // Initialise
  useEffect(() => {
    if (api && !isInitialised && account) {
      const {
        connect,
        attachEvent,
      } = api
      setIsInitialised(true)
      try {
        connect(errorReporterFactory(appDispatch))
        attachEvent('updated', (updatedValue) => {
          onStakeUpdated(dispatch, updatedValue)
        })
        attachEvent('patched', setStakeNeedsRefresh(dispatch))
        attachEvent('created', setStakeNeedsRefresh(dispatch))
        attachEvent('removed', setStakeNeedsRefresh(dispatch))
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised, appDispatch, account])

  useEffect(() => {
    if (needsRefresh && account) {
      const fetchStakeTotal = async (): Promise<void> => {
        const {
          totalStakedUSD,
          stakedBalances,
        } = await api.fetch({ account })

        dispatch({
          type: 'SET_STAKES',
          payload: stakedBalances,
        })
        dispatch({
          type: 'SET_TOTAL_STAKED_USD',
          payload: { totalStakedUSD },
        })
        dispatch({
          type: 'SET_NEEDS_REFRESH',
          payload: { needsRefresh: false },
        })
      }

      fetchStakeTotal().catch((error) => {
        reportError(new UIError(
          {
            error,
            id: 'service-fetch',
            text: 'There was an error fetching the current balance',
          },
        ))
      })
    }
  }, [dispatch, api, account, reportError, needsRefresh, appDispatch])

  const value = { state, dispatch }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider

export function withContext<T>(
  Component: React.ComponentType<T>,
  stakesAddress: StakesAddress,
): React.ComponentType<T> {
  return (props: T): React.ReactElement => (
    <ContextProvider apiAddress={stakesAddress}>
      <Component {...props} />
    </ContextProvider>
  )
}
