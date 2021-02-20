import withStorageUploadContext, {
  Context,
  Provider,
  initialState,
} from './Context'
import {
  Props,
  Action,
  ContextName,
} from './interfaces'

export {
  Context as StorageUploadContext,
  Provider as StorageUploadContextProvider,
  initialState as StorageUploadInitialState,
}
export type StorageUploadContextProps = Props
export type StorageUploadAction = Action
export type StorageUploadContextName = ContextName

export default withStorageUploadContext
