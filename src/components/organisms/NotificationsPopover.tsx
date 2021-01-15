import React, { FC } from 'react'
import Divider from '@material-ui/core/Divider'
import { PopoverProps } from '@material-ui/core/Popover'
import { Notifications } from 'context/Services/notifications/interfaces'
import PopoverCardTemplate from 'components/templates/PopoverCardTemplate'
import NotificationMessage from './NotificationMessage'

type Props = {
  notifications: Notifications
} & PopoverProps

const NotificationsPopover: FC<Props> = ({
  notifications,
  onClose,
  ...popoverProps
}) => (
  <PopoverCardTemplate
    id="notifications-menu"
    onClose={onClose}
    cardTitle="Notifications"
    {...popoverProps}
  >
    {
      Boolean(notifications) && notifications.map((notification, i) => (
        <div key={
          notification.payload.timestamp
          + notification.payload.agreementReference
        }
        >
          {Boolean(i) && <Divider />}
          <NotificationMessage {...{ notification }} />
        </div>
      ))
    }
  </PopoverCardTemplate>
)

export default NotificationsPopover
export type NotificationsPopoverProps = Props
