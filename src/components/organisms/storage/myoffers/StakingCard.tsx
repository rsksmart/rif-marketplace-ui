import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, colors } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import RoundedCard from 'components/atoms/RoundedCard'

export interface StakingCardProps {
  className?: string
  onAddFunds: () => void
  onWithdrawFunds: () => void
  balance: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: theme.spacing(100),
  },
  stakingWrapper: {
    padding: theme.spacing(3),
  },
  balanceWrapper: {
    borderTop: `1px solid ${colors.primary}`,
    padding: theme.spacing(3),
  },
  balanceActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  addFundsBtn: {
    marginRight: theme.spacing(1),
  },
}))

const StakingCard: FC<StakingCardProps> = ({
  className = '', balance, onAddFunds, onWithdrawFunds,
}) => {
  const classes = useStyles()

  return (
    <RoundedCard color="primary" className={`${classes.root} ${className}`}>
      <Grid
        container
        className={classes.stakingWrapper}
        alignItems="center"
      >
        <Grid item xs={3}>
          <Typography color="primary" align="center">
            Staking
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography component="div" color="secondary">
            The amount of RIF staked in the marketplace helps to
            {' '}
            <Box display="inline" fontWeight="fontWeightMedium">enhance your reputation</Box>
            {' '}
            and
            {' '}
            <Box display="inline" fontWeight="fontWeightMedium">position your offers</Box>
            {' '}
            at the top when selling storage.
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        className={classes.balanceWrapper}
        alignItems="center"
      >
        <Grid item xs={3}>
          <Typography align="center">BALANCE</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography color="primary">{balance}</Typography>
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.balanceActions}
        >
          <Button
            className={classes.addFundsBtn}
            variant="outlined"
            rounded
            color="primary"
            onClick={onAddFunds}
          >
            Add funds
          </Button>
          <Button
            variant="outlined"
            rounded
            color="primary"
            onClick={onWithdrawFunds}
          >
            Withdraw funds
          </Button>
        </Grid>
      </Grid>
    </RoundedCard>
  )
}

export default StakingCard
