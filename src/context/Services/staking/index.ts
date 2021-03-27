import {
  Props, State, Action, ContextName,
} from './interfaces'
import {
  Context as StakingContext,
  ContextProvider as StakingContextProvider,
  initialState as StakingInitialState,
  withContext as withStakingContext,
} from './Context'

export {
  StakingContext,
  StakingContextProvider,
  StakingInitialState,
  withStakingContext,
}

export type StakingContextName = ContextName
export type StakingContextProps = Props
export type StakingAction = Action
export type StakingContextState = State
