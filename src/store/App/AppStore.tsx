import React, { Dispatch, useReducer } from 'react'
import { AppAction } from './appActions'
import appReducer from './appReducer'

export interface IAppState {
  isError?: boolean
  isLoading?: boolean
  message?: string
  formError?: any
}

interface IAppStoreProps {
  state: {
    message: IAppState
  }
  dispatch: Dispatch<AppAction>
}

export const initialState: IAppState = {
}

const AppStore = React.createContext({} as IAppStoreProps | any)

export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
