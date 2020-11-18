import StorageContextProvider, {
  Context as StorageGlobalContext,
  initialState,
} from './Context'
import {
  Props,
  Action,
} from './interfaces'

export {
  StorageGlobalContext,
  initialState,
}

export type StorageGlobalContextProps = Props
export type StorageGlobalAction = Action

export default StorageContextProvider
