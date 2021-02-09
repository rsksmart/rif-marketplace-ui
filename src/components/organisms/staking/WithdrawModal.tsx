import {
  createStyles, Divider, makeStyles, Theme,
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import {
  StakedBalances as StakedBalancesProp,
} from 'api/rif-marketplace-cache/storage/stakes'
import AmountWithCurrencySelect from 'components/molecules/AmountWithCurrencySelect'
import CenteredContent from 'components/molecules/CenteredContent'
import { SupportedTokenSymbol, SYSTEM_SUPPORTED_SYMBOL } from 'models/Token'
import React, { FC, useEffect, useState } from 'react'
import StakedBalances from './StakedBalances'

export interface WithdrawModalProps {
  open: boolean
  onClose: () => void
  onWithdraw: (amount: number, currency: SupportedTokenSymbol) => void
  totalStakedUSD: string
  stakes: StakedBalancesProp
  checkCanWithdraw: () => Promise<boolean>
  cantWithdrawMessage: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  bodyChild: {
    padding: theme.spacing(2, 0),
  },
}))

const WithdrawModal: FC<WithdrawModalProps> = ({
  open, onClose, onWithdraw,
  totalStakedUSD, stakes,
  checkCanWithdraw,
  cantWithdrawMessage = 'You cannot withdraw your funds.',
}) => {
  const classes = useStyles()
  const currencyOptions: SupportedTokenSymbol[] = [SYSTEM_SUPPORTED_SYMBOL.rbtc, SYSTEM_SUPPORTED_SYMBOL.rif]
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedTokenSymbol>(SYSTEM_SUPPORTED_SYMBOL.rbtc)
  const [amountToWithdraw, setAmountToWithdraw] = useState<number | undefined>(undefined)
  const [withdrawEnabled, setWithdrawEnabled] = useState(true)
  const [isCheckingWithdraw, setIsCheckingWithdraw] = useState(false)

  useEffect(() => {
    const handleModalOpened = async (): Promise<void> => {
      setIsCheckingWithdraw(true)
      setWithdrawEnabled(await checkCanWithdraw())
      setIsCheckingWithdraw(false)
    }

    if (open) {
      handleModalOpened()
    }
    setAmountToWithdraw(undefined)
  }, [open, checkCanWithdraw])

  const handleCurrencyChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setSelectedCurrency(value as SupportedTokenSymbol)
  }

  const handleAmountChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setAmountToWithdraw(value as number)
  }

  const handleWithdraw = (): void => {
    onWithdraw(Number(amountToWithdraw), selectedCurrency)
  }

  const disableWithdrawAction = isCheckingWithdraw || !withdrawEnabled
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
          hidden={withdrawEnabled}
          align="center"
          color="secondary"
        >
          <Box fontWeight="fontWeightMedium">
            {cantWithdrawMessage}
          </Box>
        </Typography>
      </CenteredContent>
    </ModalDialogue>
  )
}

export default WithdrawModal
