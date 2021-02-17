import OfferEditContext, {
  Provider, initialState,
} from './Context'
import {
  Props, Action,
  ContextName,
} from './interfaces'
import actions from './actions'

export {
  Provider as OfferEditContextProvider,
  initialState as offerEditInitialState,
  actions as offerEditActions,
}
export type OfferEditContextProps = Props
export type OfferEditAction = Action
export type StorageEditOfferContextName = ContextName

export default OfferEditContext
