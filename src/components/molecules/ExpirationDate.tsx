import Typography from '@material-ui/core/Typography'
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
    color: palette.text.disabled,
  },
}))

export type SubscriptionExpirationType = 'normal' | 'warning' | 'blocked'

type Props = {
    date: Date
    type: SubscriptionExpirationType
}

const ExpirationDate: FC<Props> = ({
  date,
  type,
}) => {
  const classes = useStyles()

  return (
    <Grid
      container
      wrap="nowrap"
      alignItems="center"
      spacing={1}
      className={classes[type]}
    >
      <Grid item>
        <Typography variant="body2">
          { getShortDateString(date) }
        </Typography>
      </Grid>
      <Grid item>
        { type === 'warning' && <WatchLaterIcon /> }
      </Grid>
    </Grid>
  )
}

export default ExpirationDate
