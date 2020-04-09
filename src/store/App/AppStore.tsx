import React, { Dispatch } from 'react'
import marketReducer from 'store/Market/marketReducer'
import Middleware from 'store/storeUtils/middleware'
import { AppAction } from './appActions'

export interface IAppMessage {
  isError?: boolean
  isLoading?: boolean
  message?: string
  formError?: any
}

export interface IAppState {
  message: IAppMessage
}

interface IAppStoreProps {
  state: {
    message: IAppState
  }
  dispatch: Dispatch<AppAction>
}

export const initialState: IAppState = {
  message: {},
}

const AppStore = React.createContext({} as IAppStoreProps | any)

export const AppStoreProvider = ({ children }) => {
  const { useMiddleware } = Middleware.getInstance();

  const [state, dispatch] = useMiddleware(marketReducer, initialState);

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
