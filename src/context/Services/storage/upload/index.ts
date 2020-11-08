import withStorageUploadContext, {
  Context,
  Provider,
  initialState,
} from './Context'
import {
  Props,
  Action,
} from './interfaces'

export {
  Context as StorageUploadContext,
  Provider as StorageUploadContextProvider,
  initialState as StorageUploadInitialState,
}
export type StorageUploadContextProps = Props
export type StorageUploadAction = Action

export default withStorageUploadContext
