import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { CopyTextTooltip, shortenString } from '@rsksmart/rif-ui'
import React, { FC } from 'react'
import { shortChecksumAddress } from 'utils/stringUtils'

export interface RifAddressProps extends TypographyProps {
  pretext?: string
  value: string
  disableChecksum?: boolean
}

const RifAddress: FC<RifAddressProps> = ({
  pretext, value, disableChecksum, ...rest
}) => {
  const address = disableChecksum ? shortenString(value) : shortChecksumAddress(value)

  const displayElement = (
    <Typography {...rest}>
      {pretext
        ? `${pretext} (${address})`
        : address}
    </Typography>
  )
  return <CopyTextTooltip fullText={value} displayElement={displayElement} />
}

export default RifAddress
