import withContext, {
  Context,
  Provider,
  initialState,
} from './OffersContext'
import {
  Props,
  Actions,
  State,
} from './interfaces'

export {
  Context as StorageOffersContext,
  Provider as StorageOffersContextProvider,
  initialState as storageOffersContextInitialState,
}

export type StorageOffersContextProps = Props
export type StorageOffersContextState = State
export type StorageOffersContextActions = Actions

const withStorageOffersContext = withContext

export default withStorageOffersContext
