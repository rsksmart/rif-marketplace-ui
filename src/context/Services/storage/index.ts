import StorageContextProvider, {
  Context as StorageGlobalContext,
  initialState,
} from './Context'
import {
  Props,
  Action,
  State,
} from './interfaces'
import actions from './actions'

export {
  StorageGlobalContext,
  initialState,
  actions,
}

export type StorageGlobalContextProps = Props
export type StorageGlobalAction = Action
export type StorageGlobalContextState = State

export default StorageContextProvider
