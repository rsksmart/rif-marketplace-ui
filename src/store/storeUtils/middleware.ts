import { useEffect, useMemo, useReducer, useRef } from 'react'
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

  public useMiddleware = (reducer, initialState) => {
    const prevState = useRef(initialState)
    const [state, dispatch] = useReducer(reducer, initialState)

    const dispatchWithMiddleware = useMemo(() => {
      const withMiddleware = dispatch => {
        return action => {
          logger.debug('Action Type:', action.type)
          logger.debug('Action Payload:', action.payload)
          dispatch(action)
        }
      }

      return withMiddleware(dispatch)
    }, [dispatch])

    useEffect(() => {
      if (state !== initialState) {
        logger.debug('Prev state:', prevState.current)
        logger.debug('Next state:', state)
      } else {
        logger.debug('No change:', state)
      }
      prevState.current = state
    }, [initialState, state])

    return [state, dispatchWithMiddleware]
  };
}
