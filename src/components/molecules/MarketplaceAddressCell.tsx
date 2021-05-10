import React from 'react'
import RifAddress, { RifAddressProps } from './RifAddress'

const MarketplaceAddressCell = (props: RifAddressProps): React.ReactElement => (
  <RifAddress
    color="textPrimary"
    variant="body2"
    noWrap
    {...props}
  />
)

export default MarketplaceAddressCell
