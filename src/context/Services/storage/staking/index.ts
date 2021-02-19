import withStakingContext, {
  ContextProvider as StorageStakingProvider,
  Context as StorageStakingContext,
  initialState,
} from './Context'
import {
  Props,
  Action,
  State,
  ContextName,
} from './interfaces'
import actions from './actions'

export {
  StorageStakingContext,
  StorageStakingProvider,
  initialState as storageStakingInitialState,
  actions as storageStakingActions,
}

export type StorageStakingContextProps = Props
export type StorageStakingAction = Action
export type StorageStakingContextState = State
export type StorageStakingContextName = ContextName

export default withStakingContext
