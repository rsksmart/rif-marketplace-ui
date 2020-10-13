import React, { FC, useState } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import { createStyles, Divider, makeStyles, Theme } from '@material-ui/core'
import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import AmountWithCurrencySelect from 'components/molecules/AmountWithCurrencySelect'
import CenteredContent from 'components/molecules/CenteredContent'

export interface WithdrawModalProps {
  open: boolean
  onClose: () => void
  onWithdraw: (amount: number, currency: SupportedTokens) => void
  canWithdraw: boolean
  // TODO: current balnce will be an array of {balance: number. token: SupportedTokens}
  currentBalance: number
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  bodyChild: {
    padding: theme.spacing(2, 0),
  }
}))

const WithdrawModal: FC<WithdrawModalProps> = ({
  open, onClose, onWithdraw, canWithdraw, currentBalance
}) => {
  const classes = useStyles()
  const currencyOptions: SupportedTokens[] = ['rbtc', 'rif']
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedTokens>('rbtc')
  const [amountToWithdraw, setAmountToWithdraw] = useState<number | undefined>(undefined)

  const handleCurrencyChange = ({ target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>): void => setSelectedCurrency(value as SupportedTokens)

  const handleAmountChange = ({ target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>): void => setAmountToWithdraw(value as number)

  const handleWithdraw = () => onWithdraw(Number(amountToWithdraw), selectedCurrency)

  const disableWithdrawAction = !canWithdraw || !amountToWithdraw || amountToWithdraw > currentBalance || amountToWithdraw <= 0

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
        <Typography className={classes.bodyChild} component='div' align="center" color="secondary">
          {'Withdrawing RIF staked in the Marketplace '}
          <Box display='inline' fontWeight='fontWeightMedium'>
            downgrade your reputation
            </Box>
          and
          <Box display='inline' fontWeight='fontWeightMedium'>
            your offers will not be positioned at the top</Box>
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
            {currentBalance}
          </Box>
        </Typography>
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
