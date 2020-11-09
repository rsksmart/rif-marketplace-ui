import React, { FC } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles, Popover, PopoverProps,
} from '@material-ui/core'
import { Notifications } from 'context/Services/notifications/interfaces'
import NotificationMessage from './NotificationMessage'

const popoverStyles = makeStyles(() => ({
  paper: {
    borderRadius: '30px',
  },
}))
const cardStyles = makeStyles(() => ({
  root: {
    borderRadius: '30px',
    display: 'grid',
    justifyItems: 'center',
  },
}))
const dividerStyles = makeStyles(() => ({
  root: {
    justifySelf: 'normal',
  },
}))

type Props = {
    notifications: Notifications
} & PopoverProps

const NotificationsPopover: FC<Props> = ({
  notifications,
  onClose,
  ...popoverProps
}) => {
  const dividerClasses = dividerStyles()

  return (
    <Popover
      id="notifications-menu"
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={popoverStyles()}
      {...{ onClose }}
      {...popoverProps}
    >
      <Card classes={cardStyles()}>
        <CardHeader title="Notifications" titleTypographyProps={{ variant: 'subtitle2', color: 'secondary' }} />
        <Divider classes={dividerClasses} />
        <CardContent>
          {
              Boolean(notifications) && notifications.map((notification, i) => (
                <div key={notification.payload.timestamp}>
                  {Boolean(i) && <Divider classes={dividerClasses} />}
                  <NotificationMessage {...{ notification }} />
                </div>
              ))
            }
        </CardContent>
      </Card>
    </Popover>
  )
}

export default NotificationsPopover
export type NotificationsPopoverProps = Props
