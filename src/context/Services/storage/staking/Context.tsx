import { Web3Store } from '@rsksmart/rif-ui'
import { StakesService } from 'api/rif-marketplace-cache/storage/stakes'
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
} from 'react'
import Logger from 'utils/Logger'
import { zeroAddress } from '../interfaces'
import { reducer } from './actions'
import { Props, State } from './interfaces'

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

  const stakeApi = apis?.['storage/v0/stakes'] as StakesService
  stakeApi.connect(errorReporterFactory(appDispatch))

  // const [isInitialised, setIsInitialised] = useState(false)
  // useEffect(() => {
  //   if (stakeApi?.service && !isInitialised) {
  //     try {
  // TODO: subscribe to events so we can update values automatically
  //       // attachEvent('updated', updateValues)
  //       // attachEvent('patched', updateValues)
  //       // attachEvent('created', updateValues)
  //       // attachEvent('removed', updateValues)
  //       setIsInitialised(true)
  //     } catch (error) {
  //       setIsInitialised(false)
  //     }
  //   }
  // }, [stakeApi, isInitialised])

  useEffect(() => {
    if (needsRefresh) {
      const fetchStakeTotal = async () => {
        const [stakeRBTC] = await stakeApi.fetch({
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
  }, [dispatch, stakeApi, account, reportError, needsRefresh])

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
