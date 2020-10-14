import { Web3Store } from '@rsksmart/rif-ui'
import { StakesService } from 'api/rif-marketplace-cache/storage/stakes'
import AppContext, {
  AppContextProps,
  errorReporterFactory,
} from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import React, {
  createContext,
  Dispatch,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import Logger from 'utils/Logger'
import { zeroAddress } from '../interfaces'
import { reducer } from './actions'
import { Action, Props, State } from './interfaces'

const logger = Logger.getInstance()

export const initialState: State = {
  isFetching: true,
  totalStaked: 0,
  needsRefresh: true,
}

export const StakingContext = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

const stakeNeedsRefresh = (dispatch: Dispatch<Action>) => () => {
  dispatch({
    type: 'SET_NEEDS_REFRESH',
    payload: { needsRefresh: true }
  })
}

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
    if (api && !isInitialised) {
      const {
        connect,
        attachEvent,
      } = api
      setIsInitialised(true)
      try {
        connect(errorReporterFactory(appDispatch))
        attachEvent('updated', stakeNeedsRefresh(dispatch))
        attachEvent('patched', stakeNeedsRefresh(dispatch))
        attachEvent('created', stakeNeedsRefresh(dispatch))
        attachEvent('removed', stakeNeedsRefresh(dispatch))
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised, appDispatch])

  useEffect(() => {
    if (needsRefresh) {
      const fetchStakeTotal = async () => {
        const [stakeRBTC] = await api.fetch({
          account, token: zeroAddress,
        })
        dispatch({
          type: 'SET_TOTAL_STAKE',
          payload: { totalStaked: stakeRBTC?.total || 0 },
        })
        dispatch({
          type: 'SET_IS_FETCHING',
          payload: { isFetching: false },
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
  }, [dispatch, api, account, reportError, needsRefresh])

  const value = { state, dispatch }

  return <StakingContext.Provider value={value}>{children}</StakingContext.Provider>
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
