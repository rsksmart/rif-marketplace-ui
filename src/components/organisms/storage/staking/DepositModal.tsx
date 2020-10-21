import React, { FC, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { SupportedToken } from 'api/rif-marketplace-cache/rates/xr'
import AmountWithCurrencySelect from 'components/molecules/AmountWithCurrencySelect'
import CenteredContent from 'components/molecules/CenteredContent'
import {
  StakedBalances as StakedBalancesProp,
} from 'api/rif-marketplace-cache/storage/stakes'
import StakedBalances from './StakedBalances'

export interface DepositModalProps {
  totalStakedUSD: string
  open: boolean
  onClose: () => void
  onDeposit: (amount: number, currency: SupportedToken) => void
  stakes: StakedBalancesProp
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  bodyChild: {
    padding: theme.spacing(2, 0),
  },
}))

const DepositModal: FC<DepositModalProps> = ({
  totalStakedUSD, open, onClose, onDeposit, stakes,
}) => {
  const classes = useStyles()
  const currencyOptions: SupportedToken[] = ['rbtc', 'rif']
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedToken>('rbtc')
  const [amountToStake, setAmountToStake] = useState<number | undefined>(undefined)

  useEffect(() => {
    setAmountToStake(undefined)
  }, [open])

  const handleCurrencyChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setSelectedCurrency(value as SupportedToken)
  }

  const handleAmountChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setAmountToStake(value as number)
  }

  const handleDeposit = (): void => onDeposit(
    Number(amountToStake), selectedCurrency,
  )

  const actions: JSX.Element = (
    <Button
      color="primary"
      rounded
      variant="contained"
      onClick={handleDeposit}
      disabled={!amountToStake || amountToStake <= 0}
    >
      Stake Funds
    </Button>
  )

  return (
    <ModalDialogue
      open={open}
      onClose={onClose}
      title="Staking"
      footer={actions}
    >
      <CenteredContent>
        <Typography
          className={classes.bodyChild}
          component="div"
          align="center"
          color="secondary"
        >
          {'The amount staked in the RIF Marketplace helps to '}
          <Box fontWeight="fontWeightMedium" display="inline">
            enhance your reputation
          </Box>
          {' and '}
          <Box fontWeight="fontWeightMedium" display="inline">
            position your offers at the top of the list.
          </Box>
        </Typography>
        <Divider />
        <Typography
          className={classes.bodyChild}
          component="div"
          color="secondary"
          align="center"
        >
          {'Your current balance is '}
          <Box display="inline" fontWeight="fontWeightMedium">
            {`${totalStakedUSD} USD`}
          </Box>
        </Typography>
        <StakedBalances stakes={stakes} />
        <Divider />
        <AmountWithCurrencySelect
          className={classes.bodyChild}
          amount={amountToStake}
          onAmountChange={handleAmountChange}
          onCurrencyChange={handleCurrencyChange}
          currencyOptions={currencyOptions}
          selectedCurrency={selectedCurrency}
          amountLabel="Amount to stake"
        />
      </CenteredContent>
    </ModalDialogue>
  )
}

export default DepositModal
