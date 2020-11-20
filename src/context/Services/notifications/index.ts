import withNotificationsContext, {
  Context,
  Provider,
  initialState,
} from './Context'
import {
  Props,
  Action,
} from './interfaces'

export {
  Context as NotificationsContext,
  Provider as NotificationsContextProvider,
  initialState as notificationsInitialState,
}
export type NotificationsContextProps = Props
export type NotificationsAction = Action

export default withNotificationsContext
