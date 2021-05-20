import RoundBtn from 'components/atoms/RoundBtn'
import React, { FC, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import GridRow from 'components/atoms/GridRow'
import GridItem from 'components/atoms/GridItem'
import Grid from '@material-ui/core/Grid'
import { SupportedTokenSymbol } from 'models/Token'
import CurrencySelect from 'components/molecules/CurrencySelect'
import { SUPPORTED_FIAT, SYSTEM_SUPPORTED_FIAT } from 'models/Fiat'
import { MarketCryptoRecord, QuotationPerToken } from 'models/Market'
import Big from 'big.js'

type Props = {
  onBuy: () => void
  paymentOptions: QuotationPerToken
  // to fully support multifiat we need a refactor
  // cryptoXR should be able to provide rate per crypto per fiat
  fiatUnit: SYSTEM_SUPPORTED_FIAT
  expirationDate: string
  cryptoXRs: MarketCryptoRecord
}

const CheckoutPayment: FC<Props> = ({
  onBuy, paymentOptions, fiatUnit, expirationDate, cryptoXRs,
}) => {
  const currencyOptions = Object.keys(paymentOptions) as SupportedTokenSymbol[]
  const [fiatFinalPrice, setFiatFinalPrice] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0])

  useEffect(() => {
    const { rate } = cryptoXRs[selectedCurrency]
    const tokenPrice = paymentOptions[selectedCurrency]
    const fiatPrice = Big(tokenPrice).mul(rate).toFixed(2)
    setFiatFinalPrice(fiatPrice)
  }, [selectedCurrency, cryptoXRs, paymentOptions])

  const handleCurrencyChange = (
    { target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>,
  ): void => {
    setSelectedCurrency(value as SupportedTokenSymbol)
  }

  return (
    <>
      <GridRow>
        <GridItem md={4} sm={12}>
          <p>Select currency</p>
          <GridItem xs={12}>
            <CurrencySelect
              options={currencyOptions}
              value={selectedCurrency}
              onChange={handleCurrencyChange}
            />
          </GridItem>
        </GridItem>
        <GridItem md={4} sm={12}>
          <GridItem xs={12}>
            <Typography>Total price</Typography>
            <Typography color="primary">
              {`${paymentOptions[selectedCurrency]} ${selectedCurrency}`}
            </Typography>
            <Typography>
              {`Fiat price ${fiatFinalPrice} ${SUPPORTED_FIAT[fiatUnit].displayName}`}
            </Typography>
          </GridItem>
          <GridItem xs={12}>
            {`Expiration date: ${expirationDate}`}
          </GridItem>
        </GridItem>
        <Grid container item md={4} sm={12} justify="center">
          <RoundBtn onClick={onBuy}>Buy</RoundBtn>
          <Typography
            color="secondary"
            variant="subtitle1"
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
