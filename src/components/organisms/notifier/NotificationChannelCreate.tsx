import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { NotifierChannel, notifierChannelType } from 'models/marketItems/NotifierItem'
import { FormControl } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { SelectRowButton } from 'components/molecules'
import { useForm } from 'react-hook-form'
import Typography from '@material-ui/core/Typography'
import validateURL from 'utils/validationUtils'

export interface NotificationChannelCreateProps {
  onChannelChange: (e: any) => void
  onDestinationChange: (e: any) => void
  notifierChannel: NotifierChannel
  channelAdd: () => void
    availableChannels: string[]
}

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  select: {
    textAlign: 'center',
    height: 40,
  },
}))

type Inputs = {
    destination: string
}

const NotificationChannelCreate: FC<NotificationChannelCreateProps> = ({
  notifierChannel, availableChannels, onChannelChange, onDestinationChange, channelAdd,
}) => {
  const validateDestination = (destination: string) => {
    if (notifierChannel.type === 'API') {
      return validateURL(destination)
    }
    return true
  }
  const classes = useStyles()
  const { register, handleSubmit, errors } = useForm<Inputs>()
  return (
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={2} md={2}>
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            className={classes.select}
            id="channel-select"
            value={notifierChannel.type}
            onChange={onChannelChange}
          >
            {
        availableChannels.map((channelType) => <MenuItem value={channelType}>{channelType}</MenuItem>)
      }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={7} md={7}>
        <TextField
          name="destination"
          fullWidth
          onChange={onDestinationChange}
          placeholder={notifierChannelType[notifierChannel.type]}
          variant="outlined"
          inputRef={register({ required: true, validate: validateDestination })}
          InputProps={{
            style: { height: 40 },
          }}
        />
        {
              errors.destination && (
              <Typography color="error" variant="caption">
                Invalid destination
              </Typography>
              )
          }
      </Grid>
      <Grid item xs={3} md={3}>
        <SelectRowButton id="add-channel" handleSelect={handleSubmit(channelAdd)} size="large" variant="outlined">Add Channel</SelectRowButton>
      </Grid>
    </Grid>

  )
}

export default NotificationChannelCreate
