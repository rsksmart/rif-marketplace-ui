import React, { Dispatch, useReducer } from 'react'
import { AppAction } from './appActions'
import appReducer from './appReducer'

export interface AppStateType {
  isError?: boolean
  isLoading?: boolean
  message?: string
  formError?: any
}

interface AppStorePropsType {
  state: {
    message: AppStateType
  }
  dispatch: Dispatch<AppAction>
}

export const initialState: AppStateType = {
}

const AppStore = React.createContext({} as AppStorePropsType | any)

export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
