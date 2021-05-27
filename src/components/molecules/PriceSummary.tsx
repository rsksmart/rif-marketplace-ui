import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Big from 'big.js'
import GridItem from 'components/atoms/GridItem'
import { TokenXR } from 'models/Market'
import React, { FC } from 'react'
import { getFiatPrice } from 'utils/tokenUtils'

export type Props = {
  className?: string
  title?: string
  cryptoPrice: Big
  tokenXR: TokenXR
  fiatDisplayName: string
}

const PriceSummary: FC<Props> = ({
  className = '', title = 'Total Price',
  cryptoPrice, tokenXR, fiatDisplayName,
}) => (
  <GridItem className={className} xs={12}>
    <Typography component="div" align="center">
      <Box>{title}</Box>
      <Box
        fontWeight="fontWeightMedium"
        fontSize="h6.fontSize"
        color="primary.main"
      >
        {`${cryptoPrice} ${tokenXR.displayName}`}
      </Box>
      <Box color="text.secondary">
        {`${getFiatPrice(cryptoPrice, tokenXR)} ${fiatDisplayName}`}
      </Box>
    </Typography>
  </GridItem>
)

export default PriceSummary
