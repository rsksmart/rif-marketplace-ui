import {
  Grid, makeStyles, Theme, Typography,
} from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import Login from 'components/atoms/Login'
import RoundedCard from 'components/atoms/RoundedCard'
import React, { FC } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: theme.spacing(70),
  },
  titleContainer: {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${colors.gray3}`,
  },
  contentContainer: {
    padding: theme.spacing(3),
  },
}))

export interface LoginCardProps {
  title?: string
  contentText?: string
}

// TODO:
// - this HOC will return a component with the card min the center and the login button
// - the modal should be initially opened
// - when the user logs in (i.e. an account is provided) we show the component we receive
const LoginCard: FC<LoginCardProps> = (props) => {
  const {
    title = 'Connect your wallet',
    contentText = 'Connect your walet to see this content',
  } = props
  const classes = useStyles()

  return (
    <Grid container justify="center">
      <RoundedCard className={classes.root} color="secondary">
        <Grid container className={classes.titleContainer} justify="center">
          <Typography variant="h6" color="primary">{title}</Typography>
        </Grid>
        <Grid container className={classes.contentContainer} justify="center" spacing={2}>
          <Grid item xs={12}>
            <Typography color="secondary" align="center">{contentText}</Typography>
          </Grid>
          <Grid container justify="center">
            <Login />
          </Grid>
        </Grid>
      </RoundedCard>
    </Grid>
  )
}

export default LoginCard
