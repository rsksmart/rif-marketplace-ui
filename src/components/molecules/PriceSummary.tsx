import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Big from 'big.js'
import GridItem from 'components/atoms/GridItem'
import { SUPPORTED_FIAT, SYSTEM_SUPPORTED_FIAT } from 'models/Fiat'
import { MarketCryptoRecord } from 'models/Market'
import { SYSTEM_SUPPORTED_SYMBOL, SYSTEM_TOKENS } from 'models/Token'
import React, { FC } from 'react'

export type Props = {
  className?: string
  title?: string
  cryptoPrice: Big
  currency: SYSTEM_SUPPORTED_SYMBOL
  cryptoXRs: MarketCryptoRecord
  // to fully support multifiat we need to refactor
  // cryptoXR should be able to provide rate per crypto per fiat
  fiatUnit: SYSTEM_SUPPORTED_FIAT
}

const PriceSummary: FC<Props> = ({
  className = '', title = 'Total Price', cryptoPrice, currency, cryptoXRs, fiatUnit,
}) => {
  const { rate } = cryptoXRs[currency]
  const fiatPrice = Big(cryptoPrice).mul(rate).toFixed(2)

  return (
    <GridItem className={className} xs={12}>
      <Typography component="div" align="center">
        <Box>{title}</Box>
        <Box
          fontWeight="fontWeightMedium"
          fontSize="h6.fontSize"
          color="primary.main"
        >
          {`${cryptoPrice} ${SYSTEM_TOKENS[currency].displayName}`}
        </Box>
        <Box color="text.secondary">
          {`${fiatPrice} ${SUPPORTED_FIAT[fiatUnit].displayName}`}
        </Box>
      </Typography>
    </GridItem>
  )
}

export default PriceSummary
