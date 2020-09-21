import React, { useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { colors, Web3Store } from '@rsksmart/rif-ui'
import Login from 'components/atoms/Login'
import RoundedCard from 'components/atoms/RoundedCard'

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

const WithLoginCard = ({
  WrappedComponent,
  title = 'Connect your wallet',
  contentText = 'Connect your walet to see this content',
  ...props
}) => {
  const LoginCard = () => {
    const {
      state: { account },
    } = useContext(Web3Store)
    const classes = useStyles()

    if (account) return <WrappedComponent {...props} />
    return (
      <Grid container justify="center">
        <RoundedCard className={classes.root} color="secondary">
          {/* TODO: extract molecule */}
          <Grid container className={classes.titleContainer} justify="center">
            <Typography variant="h6" color="primary">{title}</Typography>
          </Grid>
          <Grid container className={classes.contentContainer} justify="center" spacing={2}>
            <Grid item xs={12}>
              <Typography color="secondary" align="center">{contentText}</Typography>
            </Grid>
            <Grid container justify="center">
              <Login modalInitiallyOpened />
            </Grid>
          </Grid>
        </RoundedCard>
      </Grid>
    )
  }

  return LoginCard
}

export default WithLoginCard
