import { serviceAddress } from 'api/rif-marketplace-cache/notifications'
import { NotificationItem } from 'api/rif-marketplace-cache/notifications/interfaces'
import { ContextProps, ContextState } from 'context/storeUtils/interfaces'

// STATE
export type ContextName = typeof serviceAddress

export type Notifications = NotificationItem[]

export type State = ContextState & {
    notifications: Notifications
}

// PAYLOAD
type Payload = Notifications

// ACTIONS
export type Action = ({
    type: 'SET_NOTIFICATIONS'
    payload: Payload
})

export type ActionFunctions = {
    SET_NOTIFICATIONS: (state: State, payload: Payload) => State
}

// PROPS
export type Props = ContextProps<State, Action>
