import { Web3Store } from '@rsksmart/rif-ui'
import {
  StakesService,
} from 'api/rif-marketplace-cache/storage/stakes'
import AppContext, {
  AppContextProps,
  errorReporterFactory,
} from 'context/App/AppContext'
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
import Logger from 'utils/Logger'
import { reducer } from './actions'
import {
  Props, State,
} from './interfaces'
import { onStakeUpdated, setStakeNeedsRefresh } from './utils'

const logger = Logger.getInstance()

export const initialState: State = {
  needsRefresh: true,
  totalStakedUSD: '',
  stakes: {
    rbtc: '0',
    rif: '0',
  },
}

export const StakingContext = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const ContextProvider: FC = ({ children }) => {
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const { needsRefresh } = state

  const api = apis?.['storage/v0/stakes'] as StakesService
  api.connect(errorReporterFactory(appDispatch))

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
        logger.error(`Fetch Stake total error: ${error.message}`)
      })
    }
  }, [dispatch, api, account, reportError, needsRefresh, appDispatch])

  const value = { state, dispatch }

  return (
    <StakingContext.Provider value={value}>
      {children}
    </StakingContext.Provider>
  )
}

function withStakingContext<T>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> {
  return (props: T): React.ReactElement => (
    <ContextProvider>
      <Component {...props} />
    </ContextProvider>
  )
}

export default withStakingContext
