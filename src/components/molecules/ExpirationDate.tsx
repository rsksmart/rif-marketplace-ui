import Typography, { TypographyProps } from '@material-ui/core/Typography'
import React, { FC } from 'react'
import { getShortDateString } from 'utils/dateUtils'
import {
  makeStyles, Theme,
} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import WatchLaterIcon from '@material-ui/icons/WatchLater'

const useStyles = makeStyles(({ palette }: Theme) => ({
  normal: {
    color: palette.text.secondary,
  },
  warning: {
    color: palette.warning.main,
  },
  blocked: {
    color: palette.error.main,
  },
  disabled: {
    color: palette.text.disabled,
  },
}))

export const EXPIRATION_TYPES = {
  normal: 'normal',
  warning: 'warning',
  blocked: 'blocked',
  disabled: 'disabled',
} as const

export type SubscriptionExpirationType = keyof typeof EXPIRATION_TYPES

type Props = {
  className?: string
  date: Date
  type: SubscriptionExpirationType
} & TypographyProps

const ExpirationDate: FC<Props> = ({
  className = '', date, type, ...typoProps
}) => {
  const classes = useStyles()

  return (
    <Grid
      container
      wrap="nowrap"
      alignItems="center"
      spacing={1}
      className={`${classes[type]} ${className}`}
    >
      <Grid item>
        <Typography variant="body2" {...typoProps}>
          {getShortDateString(date)}
        </Typography>
      </Grid>
      <Grid item>
        {type === 'warning' && <WatchLaterIcon />}
      </Grid>
    </Grid>
  )
}

export default ExpirationDate
