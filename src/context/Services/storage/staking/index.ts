import withStakingContext, {
  ContextProvider as StorageStakingProvider,
  Context as StorageStakingContext,
  initialState,
} from './Context'
import { ContextName } from './interfaces'

export {
  StorageStakingContext,
  StorageStakingProvider,
  initialState as storageStakingInitialState,
}

export type StorageStakingContextName = ContextName

export default withStakingContext
