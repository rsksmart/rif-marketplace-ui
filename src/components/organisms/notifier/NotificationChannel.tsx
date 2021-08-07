import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { colors, shortenString } from '@rsksmart/rif-ui'
import { SelectedEventChannel } from 'models/marketItems/NotifierItem'
import RemovableRow from 'components/organisms/RemovableRow'

export interface NotificationChannelProps {
  className?: string
  onRemoveClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  channel: SelectedEventChannel
}

const NotificationChannel: FC<NotificationChannelProps> = ({
  channel, onRemoveClick,
}) => (
  <RemovableRow id={channel.type} handleSelect={onRemoveClick}>
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
  </RemovableRow>
)

export default NotificationChannel
