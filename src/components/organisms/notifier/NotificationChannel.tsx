import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { colors, shortenString } from '@rsksmart/rif-ui'
import { NotifierChannel } from 'models/marketItems/NotifierItem'
import RemoveButton from 'components/atoms/RemoveButton'

export interface NotificationChannelProps {
  className?: string
  onRemoveClick: (e: any) => void
  channel: NotifierChannel
}

const useStyles = makeStyles((theme: Theme) => ({
  innerContainer: {
    backgroundColor: colors.transparent,
    borderRadius: 10,
    padding: theme.spacing(2),
    border: `1px solid ${colors.gray3}`,
    height: '25%',
  },
  leftContent: {
    [theme.breakpoints.up('sm')]: {
      borderRight: `1px solid ${colors.gray3}`,
    },
  },
}))

const NotificationChannel: FC<NotificationChannelProps> = ({
  className = '', channel, onRemoveClick,
}) => {
  const classes = useStyles()

  return (
    <Grid className={className} container alignItems="center" spacing={2}>
      <Grid item xs={9}>
        <Grid
          container
          alignItems="center"
          className={classes.innerContainer}
          spacing={1}
        >
          <Grid xs={3} item>
            <Typography component="div">
              <Box fontWeight="fontWeightMedium" textAlign="center" color={colors.gray5}>
                {channel.type}
              </Box>
            </Typography>
          </Grid>
          <Grid xs={6} item style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {shortenString(channel.destination, 30, 25)}
          </Grid>
          <Grid xs={3} item>
            <RemoveButton
              style={{
                maxWidth: '20px', maxHeight: '20px', minWidth: '20px', minHeight: '20px',
              }}
              id={channel.type}
              handleSelect={onRemoveClick}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  )
}

export default NotificationChannel
