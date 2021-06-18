import Box from '@material-ui/core/Box'
import Grow from '@material-ui/core/Grow'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'
import StakingFab from 'components/molecules/staking/StakingFab'
import React, { FC, useState } from 'react'
import { StakedBalances } from 'api/rif-marketplace-cache/common/stakes'
import { SupportedTokenSymbol } from 'models/Token'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import StakingCard from './StakingCard'

export type StakingTemplateProps = {
  checkCanWithdraw: () => Promise<boolean>
  isEnabled: boolean
  isProcessing: boolean
  stakedBalances: StakedBalances
  totalStakedUSD: string
  onDeposit: (amount: number, currency: SupportedTokenSymbol) => Promise<void>
  onWithdraw: (amount: number, currency: SupportedTokenSymbol) => Promise<void>
  cantWithdrawMessage?: string
  bringToFront?: boolean
}

const stakingIconSize = 10

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'relative',
  },
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    right: 0,
    position: 'absolute',
  },
  bringToFront: {
    zIndex: 99,
  },
  cardWrapper: {
    maxWidth: '600px',
    width: '100%',
  },
  infoContainer: {
    border: `${colors.primary} 1px solid`,
    alignItems: 'center',
    borderRadius: '50px 0px 0px 50px',
    paddingRight: theme.spacing(stakingIconSize / 2),
    backgroundColor: colors.white,
    whiteSpace: 'nowrap',
    height: theme.spacing(stakingIconSize),
  },
  stakingIcon: {
    height: theme.spacing(stakingIconSize),
    minWidth: theme.spacing(stakingIconSize),
    marginLeft: -theme.spacing(stakingIconSize / 2),
  },
  fabTitle: {
    position: 'absolute',
    top: '-25px',
    right: '15px',
  },
}))

const StakingTemplate: FC<StakingTemplateProps> = (props) => {
  const {
    checkCanWithdraw,
    isEnabled,
    isProcessing,
    stakedBalances,
    totalStakedUSD,
    onDeposit,
    onWithdraw,
    cantWithdrawMessage = 'You cannot withdraw your funds.',
    bringToFront,
  } = props
  const classes = useStyles()

  const [isExpanded, setIsExpanded] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [withdrawOpened, setWithdrawOpened] = useState(false)

  const handleWithdraw = async (
    amount: number, currency: SupportedTokenSymbol,
  ): Promise<void> => {
    await onWithdraw(amount, currency)
    setWithdrawOpened(false)
  }

  const handleDeposit = async (
    amount: number, currency: SupportedTokenSymbol,
  ): Promise<void> => {
    await onDeposit(amount, currency)
    setDepositOpened(false)
  }

  return (
    <div className={classes.wrapper}>
      <div className={`${classes.root} ${bringToFront && classes.bringToFront}`}>
        <Typography
          className={classes.fabTitle}
          component="div"
          color="primary"
        >
          <Box fontWeight="fontWeightRegular">
            Staking
          </Box>
        </Typography>
        <Grow in={isExpanded}>
          <div className={classes.cardWrapper}>
            <StakingCard
              className={classes.infoContainer}
              onAddFundsClicked={(): void => setDepositOpened(true)}
              onWithdrawClicked={(): void => setWithdrawOpened(true)}
              totalStakedUSD={totalStakedUSD || '0.00'}
              isAwaitingConfirmations={isProcessing}
            />
          </div>
        </Grow>
        <StakingFab
          disabled={!isEnabled}
          className={classes.stakingIcon}
          onClick={(): void => setIsExpanded((exp) => !exp)}
        />
      </div>
      <DepositModal
        totalStakedUSD={totalStakedUSD}
        stakes={stakedBalances}
        onDeposit={handleDeposit}
        open={depositOpened}
        onClose={(): void => setDepositOpened(false)}
      />
      <WithdrawModal
        checkCanWithdraw={checkCanWithdraw}
        onClose={(): void => setWithdrawOpened(false)}
        open={withdrawOpened}
        onWithdraw={handleWithdraw}
        totalStakedUSD={totalStakedUSD}
        stakes={stakedBalances}
        cantWithdrawMessage={cantWithdrawMessage}
      />
    </div>
  )
}

export default StakingTemplate
