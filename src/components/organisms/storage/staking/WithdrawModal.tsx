import {
  createStyles, Divider, makeStyles, Theme,
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { StakedBalances as StakedBalancesProp } from 'api/rif-marketplace-cache/storage/stakes'
import AmountWithCurrencySelect from 'components/molecules/AmountWithCurrencySelect'
import CenteredContent from 'components/molecules/CenteredContent'
import { SupportedTokens, SYSTEM_SUPPORTED_TOKENS } from 'models/Token'
import React, { FC, useEffect, useState } from 'react'
import StakedBalances from './StakedBalances'

export interface WithdrawModalProps {
  open: boolean
  onClose: () => void
  onWithdraw: (amount: number, currency: SupportedTokens) => void
  canWithdraw: boolean
  totalStakedUSD: string
  stakes: StakedBalancesProp
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  bodyChild: {
    padding: theme.spacing(2, 0),
  },
}))

const WithdrawModal: FC<WithdrawModalProps> = ({
  open, onClose, onWithdraw, canWithdraw, totalStakedUSD, stakes,
}) => {
  const classes = useStyles()
  const currencyOptions: SupportedTokens[] = [SYSTEM_SUPPORTED_TOKENS.rbtc, SYSTEM_SUPPORTED_TOKENS.rif]
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedTokens>(SYSTEM_SUPPORTED_TOKENS.rbtc)
  const [amountToWithdraw, setAmountToWithdraw] = useState<number | undefined>(undefined)

  useEffect(() => {
    setAmountToWithdraw(undefined)
  }, [open])

  const handleCurrencyChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setSelectedCurrency(value as SupportedTokens)
  }

  const handleAmountChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setAmountToWithdraw(value as number)
  }

  const handleWithdraw = (): void => {
    onWithdraw(Number(amountToWithdraw), selectedCurrency)
  }

  const disableWithdrawAction = !canWithdraw
    || !amountToWithdraw
    || amountToWithdraw <= 0
    || amountToWithdraw > Number(stakes[selectedCurrency])

  const actions: JSX.Element = (
    <Button
      disabled={disableWithdrawAction}
      color="primary"
      rounded
      variant="contained"
      onClick={handleWithdraw}
    >
      Withdraw funds
    </Button>
  )

  return (
    <ModalDialogue
      open={open}
      onClose={onClose}
      title="Withdraw stake"
      footer={actions}
    >
      <CenteredContent>
        <Typography
          className={classes.bodyChild}
          component="div"
          align="center"
          color="secondary"
        >
          {'Withdrawing staked funds will '}
          <Box display="inline" fontWeight="fontWeightMedium">
            downgrade your reputation
          </Box>
          {' and '}
          <Box display="inline" fontWeight="fontWeightMedium">
            your offers will not be positioned at the top
          </Box>
          {' when selling storage.'}
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
          amount={amountToWithdraw}
          onAmountChange={handleAmountChange}
          onCurrencyChange={handleCurrencyChange}
          currencyOptions={currencyOptions}
          selectedCurrency={selectedCurrency}
          amountLabel="Amount to withdraw"
        />
        <Divider />

        <Typography
          className={classes.bodyChild}
          component="div"
          hidden={canWithdraw}
          align="center"
          color="secondary"
        >
          <Box fontWeight="fontWeightMedium">
            You cannot withdraw funds because all your contracts are running.
            Please wait until your contract finish
          </Box>
        </Typography>
      </CenteredContent>
    </ModalDialogue>
  )
}

export default WithdrawModal
