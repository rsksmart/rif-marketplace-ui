import withContext, {
  Context,
  Provider,
  initialState,
} from './OffersContext'
import {
  Props,
  Actions,
  State,
  ContextName,
} from './interfaces'
import actions from './offersActions'

export {
  Context as StorageOffersContext,
  Provider as StorageOffersContextProvider,
  initialState as storageOffersInitialState,
  actions as storageOffersActions,
}

export type StorageOffersContextProps = Props
export type StorageOffersState = State
export type StorageOffersContextActions = Actions
export type StorageOffersContextName = ContextName

const withStorageOffersContext = withContext

export default withStorageOffersContext
