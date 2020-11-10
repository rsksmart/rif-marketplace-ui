import withWithdrawContext, {
  Context as StorageWithdrawContext,
  initialState,
} from './Context'
import {
  Props,
  Action,
} from './interfaces'

export {
  StorageWithdrawContext,
  initialState,
}

export type StorageWithdrawContextProps = Props
export type StorageWithdrawAction = Action

export default withWithdrawContext
