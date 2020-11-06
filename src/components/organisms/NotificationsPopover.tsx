import React, { FC } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  ListItem,
  makeStyles, Popover, PopoverProps, Typography,
} from '@material-ui/core'
import { Notifications } from 'context/Services/notifications/interfaces'
import { HashInfoPayload, MessageCodesEnum, NotificationItem } from 'api/rif-marketplace-cache/notifications/interfaces'

type CodeMessage = {
  [K in MessageCodesEnum]: (notification: NotificationItem) => string
}

// This might eventually map to more complex messages/components
const codeMessageMap: CodeMessage = {
  [MessageCodesEnum.I_AGREEMENT_NEW]: ({ payload: { agreementReference } }) => `New agreement ${agreementReference} created.`,
  [MessageCodesEnum.I_AGREEMENT_EXPIRED]: ({ payload: { agreementReference } }) => `Agreement ${agreementReference} expired.`,
  [MessageCodesEnum.E_AGREEMENT_SIZE_LIMIT_EXCEEDED]: ({ payload: { agreementReference } }) => `Size limit exceeded for agreement ${agreementReference}`,
  [MessageCodesEnum.I_HASH_PINNED]: (notification) => {
    const { hash } = notification.payload as HashInfoPayload

    return `Hash ${hash} successfully pinned.`
  },
}

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
          !!notifications && notifications.map((item, i) => (
            <ListItem
              key={item.timestamp}
              onClick={(evt): void => (!!onClose && onClose(evt, 'escapeKeyDown')) as void}
            >
              {!!i && <Divider classes={dividerClasses} />}
              <Typography variant="caption">
                {codeMessageMap[item.code](item)}
              </Typography>
            </ListItem>
          ))
        }
        </CardContent>
      </Card>
    </Popover>
  )
}

export default NotificationsPopover
export type NotificationsPopoverProps = Props
