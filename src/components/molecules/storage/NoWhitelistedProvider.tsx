import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import React, { FC } from 'react'

const useStyles = makeStyles(() => (
  {
    root: {
      color: 'red',
    },
  }
))

type Props = {
  service: 'Storage' | 'Notifications'
}

const NoWhitelistedProvider: FC<Props> = ({ service }) => {
  const classes = useStyles()
  return (
    <Typography className={classes.root}>
      {`* The account is not registered as a ${service} 
      provider for this Beta version.`}
    </Typography>
  )
}

export default NoWhitelistedProvider
