import { useEffect, useMemo, useReducer, useRef } from 'react'
import appReducer from 'store/App/appReducer'
import Logger from 'utils/Logger'

const logger = Logger.getInstance()

export default class Middleware {

  public static getInstance(): Middleware {
    if (!Middleware.instance) {
      Middleware.instance = new Middleware()
    }
    return Middleware.instance
  }
  private static instance: Middleware

  private constructor() { }

  // From: https://github.com/the-road-to-learn-react/use-combined-reducers/blob/master/src/index.js
  public useCombinedReducers = combinedReducers => {
    // Global State
    const state = Object.keys(combinedReducers).reduce(
      (acc, key) => ({
        ...acc,
        [key]: combinedReducers[key][0],
      }),
      {},
    )

    // Global Dispatch Function
    const dispatch = action =>
      Object.keys(combinedReducers)
        .map(key => {
          return combinedReducers[key][1]
        })
        .forEach(fn => {
          fn(action)
        })

    return [state, dispatch]
  };

  public useMiddleware = (stateName: string, reducer, initialState) => {
    const prevState = useRef(initialState)
    const [state, dispatch] = useReducer(reducer, initialState)

    const [appState, appDispatch] = useReducer(appReducer, {
      message: {},
    })

    const [combinedState, combinedDispatch] = this.useCombinedReducers({
      [stateName]: [state, dispatch],
      AppState: [appState, action => appDispatch(action)],
    })

    const dispatchWithMiddleware = useMemo(() => {
      const withMiddleware = dispatch => {
        return action => {
          logger.debug('Action Type:', action.type)
          logger.debug('Action Payload:', action.payload)
          dispatch(action)
        }
      }

      return withMiddleware(combinedDispatch)
    }, [combinedDispatch])

    useEffect(() => {
      if (combinedState !== initialState) {
        logger.debug('Prev state:', prevState.current)
        logger.debug('Next state:', combinedState)
      } else {
        logger.debug('No change:', combinedState)
      }
      prevState.current = combinedState
    }, [initialState, combinedState])

    return [combinedState, dispatchWithMiddleware]
  };
}
