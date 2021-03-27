import {
  Props,
  Actions,
  State,
  ContextName,
  Action,
} from './interfaces'
import {
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
export type NotifierOffersContextAction = Action
export type OffersContextName = ContextName
