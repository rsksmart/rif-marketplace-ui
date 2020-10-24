import withRenewContext, {
  Context as StorageRenewContext,
  initialState,
} from './Context'
import {
  Props,
  Action,
  Order,
} from './interfaces'

export {
  StorageRenewContext,
  initialState,
}
export type ContextProps = Props
export type StorageRenewAction = Action
export type StorageRenewOrder = Order

export default withRenewContext
