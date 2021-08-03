import RoundBtn from 'components/atoms/RoundBtn'
import React, {
  FC, useState, useEffect, useContext,
} from 'react'
import Typography from '@material-ui/core/Typography'
import GridRow from 'components/atoms/GridRow'
import Grid, { GridProps } from '@material-ui/core/Grid'
import { TokenXR } from 'models/Market'
import ExpirationDate from 'components/molecules/ExpirationDate'
import PriceSummary from 'components/molecules/PriceSummary'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import RoundedCard from 'components/atoms/RoundedCard'
import Big from 'big.js'
import { LabeledCheckbox, Web3Store } from '@rsksmart/rif-ui'
import { getBalance } from 'contracts/utils/accountBalance'
import NotEnoughFunds from 'components/atoms/NotEnoughFunds'
import Web3 from 'web3'
import useErrorReporter from 'hooks/useErrorReporter'

type Props = {
  onBuy: () => void
  fiatDisplayName: string
  expirationDate: Date
  tokenXR: TokenXR
  cryptoPrice: Big
}

const useStyles = makeStyles((theme: Theme) => ({
  priceSummaryCard: {
    padding: theme.spacing(1.5, 3),
    marginBottom: theme.spacing(1),
  },
  expirationDate: {
    justifyContent: 'center',
  },
  termsCheckbox: {
    width: 'auto',
  },
}))

const CheckoutPayment: FC<Props> = ({
  onBuy, fiatDisplayName, expirationDate, tokenXR, cryptoPrice,
}) => {
  const classes = useStyles()
  const reportError = useErrorReporter()

  const { state: { web3, account } } = useContext(Web3Store)
  const [hasEnoughFunds, setHasEnoughFunds] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)

  const {
    symbol: selectedTokenSymbol,
  } = tokenXR

  useEffect(() => {
    const calculateBalance = async (): Promise<void> => {
      try {
        setIsLoadingBalance(true)
        const balance = await getBalance(
          web3 as Web3, account as string, selectedTokenSymbol,
        )
        setHasEnoughFunds(Big(balance).gte(cryptoPrice))
      } catch (error) {
        reportError({
          error,
          id: 'get-balance',
          text: 'Could not read account balance',
        })
      } finally {
        setIsLoadingBalance(false)
      }
    }
    calculateBalance()
  }, [account, web3, selectedTokenSymbol, cryptoPrice, reportError])

  const handleTermsChange = (): void => setTermsChecked((prev) => !prev)

  const colProps: GridProps = {
    container: true,
    item: true,
    direction: 'column',
    md: 6,
    sm: 12,
    alignItems: 'center',
    justify: 'center',
  }
  const isBuyDisabled = !hasEnoughFunds || isLoadingBalance || !termsChecked

  return (
    <>
      <Typography component="div" variant="caption" gutterBottom>
        <Box>
          {`To acquire this notification service you have to select 
          the currency to get the final price.`}
        </Box>
        <Box>
          You can add more events to this contract before or after renew.
        </Box>
      </Typography>
      <GridRow spacing={3} alignItems="center">
        <Grid {...colProps}>
          <RoundedCard className={classes.priceSummaryCard} color="primary">
            <PriceSummary
              cryptoPrice={cryptoPrice}
              tokenXR={tokenXR}
              fiatDisplayName={fiatDisplayName}
            />
          </RoundedCard>
          <GridRow justify="center">
            <Typography color="secondary" align="center">Expiration date</Typography>
            <ExpirationDate
              className={classes.expirationDate}
              type="normal"
              date={expirationDate}
            />
          </GridRow>
        </Grid>
        <Grid {...colProps}>
          {
            !isLoadingBalance && !hasEnoughFunds && (
              <NotEnoughFunds token={tokenXR} />
            )
          }
          <GridRow justify="center">
            <LabeledCheckbox
              checked={termsChecked}
              onChange={handleTermsChange}
              labelClassName={classes.termsCheckbox}
              labelText="I have read and agreed with the terms and conditions"
            />
            <RoundBtn
              disabled={isBuyDisabled}
              onClick={onBuy}
            >
              Buy
            </RoundBtn>
          </GridRow>
          <Typography
            color="secondary"
            variant="caption"
            align="center"
          >
            {`Your wallet will open and you will be asked
               to confirm the transaction for buying the notification plan.`}
          </Typography>
        </Grid>
      </GridRow>
    </>
  )
}

export default CheckoutPayment
