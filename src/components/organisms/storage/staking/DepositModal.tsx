import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Button, ModalDialogue, Web3Store } from '@rsksmart/rif-ui'
import { StakedBalances as StakedBalancesProp } from 'api/rif-marketplace-cache/storage/stakes'
import AmountWithCurrencySelect from 'components/molecules/AmountWithCurrencySelect'
import CenteredContent from 'components/molecules/CenteredContent'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import Big from 'big.js'
import { getBalance } from 'contracts/utils/accountBalance'
import { convertToWeiString } from 'utils/parsers'
import { SupportedTokenSymbol, SYSTEM_SUPPORTED_SYMBOL } from 'models/Token'
import StakedBalances from './StakedBalances'

export interface DepositModalProps {
  totalStakedUSD: string
  open: boolean
  onClose: () => void
  onDeposit: (amount: number, currency: SupportedTokenSymbol) => void
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
  const currencyOptions: SupportedTokenSymbol[] = [SYSTEM_SUPPORTED_SYMBOL.rbtc, SYSTEM_SUPPORTED_SYMBOL.rif]
  const [selectedToken, setSelectedToken] = useState<SupportedTokenSymbol>(SYSTEM_SUPPORTED_SYMBOL.rbtc)
  const [amountToStake, setAmountToStake] = useState<number | undefined>(undefined)
  const [accountWeiBalance, setAccountWeiBalance] = useState(Big(0))

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)

  useEffect(() => {
    setAmountToStake(undefined)
  }, [open])

  useEffect(() => {
    if (account && web3) {
      const calculateBalance = async (): Promise<void> => {
        const balance = await getBalance(web3, account, selectedToken)
        setAccountWeiBalance(Big(balance))
      }
      calculateBalance()
    }
  }, [account, web3, selectedToken])

  const handleCurrencyChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setSelectedToken(value as SupportedTokenSymbol)
  }

  const handleAmountChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string, value: unknown }>): void => {
    setAmountToStake(value as number)
  }

  const handleDeposit = (): void => onDeposit(
    Number(amountToStake), selectedToken,
  )

  const isPositiveAmount = amountToStake && amountToStake > 0
  const enoughFunds = amountToStake
    && Big(convertToWeiString(amountToStake)).lte(accountWeiBalance)

  const isValidAmount = isPositiveAmount && enoughFunds

  const actions: JSX.Element = (
    <Button
      color="primary"
      rounded
      variant="contained"
      onClick={handleDeposit}
      disabled={!isValidAmount}
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
          selectedCurrency={selectedToken}
          amountLabel="Amount to stake"
        />
        {
          isPositiveAmount && !enoughFunds
          && (
            <Typography color="error" align="center">
              {`You do not have enough ${selectedToken.toUpperCase()}`}
            </Typography>
          )
        }
      </CenteredContent>
    </ModalDialogue>
  )
}

export default DepositModal
