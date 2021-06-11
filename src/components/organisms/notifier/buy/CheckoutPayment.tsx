import RoundBtn from 'components/atoms/RoundBtn'
import React, { FC } from 'react'
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
}))

const CheckoutPayment: FC<Props> = ({
  onBuy, fiatDisplayName, expirationDate, tokenXR, cryptoPrice,
}) => {
  const classes = useStyles()

  const colProps: GridProps = {
    container: true,
    item: true,
    direction: 'column',
    md: 6,
    sm: 12,
    alignItems: 'center',
    justify: 'center',
  }

  // compare cryptoPrice with tokenXR.address.getBalance?

  // useEffect(() => {
  //   if (account && web3) {
  //     const calculateBalance = async (): Promise<void> => {
  //       const balance = await getBalance(web3, account, tokenXR.symbol)
  //       setAccountWeiBalance(Big(balance))
  //     }
  //     calculateBalance()
  //   }
  // }, [account, web3, selectedToken])

  // debugger

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
          <GridRow justify="center">
            <RoundBtn onClick={onBuy}>Buy</RoundBtn>
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
