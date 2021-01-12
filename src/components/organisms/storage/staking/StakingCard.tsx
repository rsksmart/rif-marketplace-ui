import { Box, Grid, Typography } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Button } from '@rsksmart/rif-ui'
import GridItem from 'components/atoms/GridItem'
import StakingBalance from 'components/molecules/storage/StakingBalance'
import React, { FC } from 'react'

export type StakingCardProps = {
  className?: string
  isAwaitingConfirmations?: boolean
  totalStakedUSD: string
  onWithdrawClicked: () => void
  onAddFundsClicked: () => void
}

const useStyles = makeStyles(() => createStyles({
  infoColumn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}))

const StakingCard: FC<StakingCardProps> = (props) => {
  const {
    className = '',
    isAwaitingConfirmations,
    totalStakedUSD,
    onWithdrawClicked,
    onAddFundsClicked,
  } = props
  const classes = useStyles()

  const withdrawButtonEnabled = Boolean(Number(totalStakedUSD))
    && !isAwaitingConfirmations

  return (
    <Grid
      container
      className={className}
    >
      <GridItem
        xs={4}
        className={classes.infoColumn}
      >
        <Typography component="div" color="secondary">
          <Box fontWeight="fontWeightRegular">BALANCE</Box>
        </Typography>
        <StakingBalance
          isLoading={isAwaitingConfirmations}
          totalStaked={isAwaitingConfirmations ? '' : totalStakedUSD}
          units={isAwaitingConfirmations ? '-' : 'USD'}
        />
      </GridItem>
      <GridItem
        xs={4}
        className={classes.infoColumn}
      >
        <Button
          onClick={onAddFundsClicked}
          color="primary"
          rounded
          variant="outlined"
          disabled={isAwaitingConfirmations}
        >
          Add funds
        </Button>
      </GridItem>
      <GridItem
        xs={4}
        className={classes.infoColumn}
      >
        <Button
          onClick={onWithdrawClicked}
          rounded
          variant="outlined"
          disabled={!withdrawButtonEnabled}
        >
          Withdraw funds
        </Button>
      </GridItem>
    </Grid>
  )
}

export default StakingCard
