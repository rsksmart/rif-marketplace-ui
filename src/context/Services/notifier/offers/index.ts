import {
  Props,
  Actions,
  State,
  ContextName,
} from './interfaces'
import withContext, {
  Context,
  Provider,
  initialState,
} from './Context'
import actions from './actions'

export {
  Context as NotifierOffersContext,
  Provider as NotifierOffersContextProvider,
  initialState as notifierOffersInitialState,
  actions as notifierOffersActions,
}

export type NotifierOffersContextProps = Props
export type NotifierOffersState = State
export type NotifierOffersContextActions = Actions
export type OffersContextName = ContextName

const withNotifierOffersContext = withContext

export default withNotifierOffersContext
