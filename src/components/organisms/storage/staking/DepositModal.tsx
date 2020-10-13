import React, { FC, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue } from '@rsksmart/rif-ui'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import AmountWithCurrencySelect from 'components/molecules/AmountWithCurrencySelect'
import CenteredContent from 'components/molecules/CenteredContent'

export interface DepositModalProps {
  // TODO: current balnce will be an array of {balance: number. token: SupportedTokens}
  currentBalance: string
  open: boolean
  onClose: () => void
  onDeposit: (amount: number, currency: SupportedTokens) => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  bodyChild: {
    padding: theme.spacing(2, 0),
  },
}))

const DepositModal: FC<DepositModalProps> = ({
  currentBalance, open, onClose, onDeposit,
}) => {
  const classes = useStyles()
  const currencyOptions: SupportedTokens[] = ['rbtc', 'rif']
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedTokens>('rbtc')
  const [amountToStake, setAmountToStake] = useState<number | undefined>(undefined)

  const handleCurrencyChange = ({ target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>): void => setSelectedCurrency(value as SupportedTokens)

  const handleAmountChange = ({ target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>): void => setAmountToStake(value as number)

  const handleDeposit = () => onDeposit(Number(amountToStake), selectedCurrency)

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
      title="Stacking"
      footer={actions}
    >
      <CenteredContent>
        <Typography
          className={classes.bodyChild}
          component="div"
          align="center"
          color="secondary"
        >
          {'The amount of RIF staked in RIF Marketplace helps to '}
          <Box fontWeight="fontWeightMedium" display="inline">
            enhance your reputation
          </Box>
          {' and '}
          <Box fontWeight="fontWeightMedium" display="inline">
            position your offers at the top
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
            {currentBalance}
          </Box>
        </Typography>
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
