import React, { FC } from 'react'
import Divider from '@material-ui/core/Divider'
import { PopoverProps } from '@material-ui/core/Popover'
import { Notifications } from 'context/Services/notifications/interfaces'
import PopoverCardTemplate from 'components/templates/PopoverCardTemplate'
import Typography from '@material-ui/core/Typography'
import NotificationMessage from './NotificationMessage'

type Props = {
  notifications: Notifications
} & PopoverProps

const NotificationsPopover: FC<Props> = ({
  notifications,
  onClose,
  ...popoverProps
}) => {
  const renderContent = (): JSX.Element => {
    if (!notifications.length) {
      return (
        <Typography variant="caption">
          No new notifications
        </Typography>
      )
    }
    return (
      <>
        {
          notifications.map((notification, i) => (
            <div key={
              notification.payload.timestamp.toString() +
              notification.payload.agreementReference
            }
            >
              {Boolean(i) && <Divider />}
              <NotificationMessage {...{ notification }} />
            </div>
          ))
        }
      </>
    )
  }
  return (
    <PopoverCardTemplate
      id="notifications-menu"
      onClose={onClose}
      cardTitle="Notifications"
      {...popoverProps}
    >
      {renderContent()}
    </PopoverCardTemplate>
  )
}

export default NotificationsPopover
export type NotificationsPopoverProps = Props
