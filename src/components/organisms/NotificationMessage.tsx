import { HashInfoPayload, MessageCodesEnum, NotificationItem } from 'api/rif-marketplace-cache/notifications/interfaces'
import { getShortDateString } from 'utils/dateUtils'
import { shortenString } from '@rsksmart/rif-ui'
import React, { FC } from 'react'
import { Box, Typography } from '@material-ui/core'

export type NotificationMessageProps = {
  notification: NotificationItem
}
const NotificationMessage: FC<NotificationMessageProps> = (
  { notification },
) => {
  const {
    payload,
  } = notification
  const {
    agreementReference,
    code,
    timestamp,
  } = payload

  const { hash } = payload as HashInfoPayload

  switch (code) {
    case MessageCodesEnum.I_AGREEMENT_NEW:
      return (
        <Box mr={1} display="inline">
          <Typography variant="caption" color="textPrimary">{`${getShortDateString(new Date(timestamp))} - `}</Typography>
          <Typography variant="caption">{'New agreement '}</Typography>
          <Typography variant="caption" color="primary">{` ${shortenString(agreementReference)} `}</Typography>
          <Typography variant="caption">{' created.'}</Typography>
        </Box>
      )
    case MessageCodesEnum.I_AGREEMENT_EXPIRED:
      return (
        <Box mr={1} display="inline">
          <Typography variant="caption" color="textPrimary">{`${getShortDateString(new Date(timestamp))} - `}</Typography>
          <Typography variant="caption">{'Agreement '}</Typography>
          <Typography variant="caption" color="primary">{` ${shortenString(agreementReference)} `}</Typography>
          <Typography variant="caption">{' expired.'}</Typography>
        </Box>
      )
    case MessageCodesEnum.E_AGREEMENT_SIZE_LIMIT_EXCEEDED:
      return (
        <Box mr={1} display="inline">
          <Typography variant="caption" color="textPrimary">{`${getShortDateString(new Date(timestamp))} - `}</Typography>
          <Typography variant="caption">{'Size limit exceeded for agreement '}</Typography>
          <Typography variant="caption" color="primary">
            {` ${shortenString(agreementReference)}.`}
          </Typography>
        </Box>
      )
    case MessageCodesEnum.I_HASH_PINNED:
      return (
        <Box mr={1} display="inline">
          <Typography variant="caption" color="textPrimary">{`${getShortDateString(new Date(timestamp))} - `}</Typography>
          <Typography variant="caption">{'Hash '}</Typography>
          <Typography variant="caption" color="primary">{` ${shortenString(hash)} `}</Typography>
          <Typography variant="caption">{' successfully pinned.'}</Typography>
        </Box>
      )
    default: return null
  }
}

export default NotificationMessage
