import NotificationsContext, {
  Provider,
  initialState,
} from './Context'
import {
  Props,
  Action,
} from './interfaces'

export {
  Provider as NotificationsContextProvider,
  initialState as notificationsInitialState,
}
export type NotificationsContextProps = Props
export type NotificationsAction = Action

export default NotificationsContext
