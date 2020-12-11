import {
  Context,
  Provider,
  initialState,
} from './Context'

import {
  Props, Action,
} from './interfaces'

export {
  Context as ConfirmationsContext,
  Provider as ConfirmationsContextProvider,
  initialState as confirmationsInitialState,
}
export type ConfirmationsContextProps = Props
export type ConfirmationsAction = Action
