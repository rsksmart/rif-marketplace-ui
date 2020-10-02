import withCheckoutContext, {
  Context as StorageCheckoutContext,
  initialState,
} from './Context'
import {
  Props,
  Action,
  Order,
  PinnedContent,
} from './interfaces'

export {
  StorageCheckoutContext,
  initialState,
}
export type ContextProps = Props
export type StorageCheckoutAction = Action
export type StorageCheckoutOrder = Order
export type StoragePinnedContent = PinnedContent

export default withCheckoutContext
