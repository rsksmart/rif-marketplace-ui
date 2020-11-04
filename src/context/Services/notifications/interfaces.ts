import { serviceAddress } from 'api/rif-marketplace-cache/notifications'
import { NotificationsItem } from 'api/rif-marketplace-cache/notifications/interfaces'
import { ContextProps, ContextState } from 'context/storeUtils/interfaces'

// STATE
export type ContextName = typeof serviceAddress
export type State = ContextState & {
    notifications: NotificationsItem[]
}

// PAYLOAD

// ACTIONS
export type Action = ({
    type: 'NOOP'
})

export type ActionFunctions = {}

// PROPS
export type Props = ContextProps<State, Action>
