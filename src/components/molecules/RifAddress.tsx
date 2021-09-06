import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { CopyTextTooltip, shortenString } from '@rsksmart/rif-ui'
import React, { FC } from 'react'
import { shortChecksumAddress } from 'utils/stringUtils'

export interface AddressItemProps extends TypographyProps {
  pretext?: string
  value: string
  disableChecksum?: boolean
}

<<<<<<< HEAD
const RifAddress: FC<AddressItemProps> = ({ pretext, value, ...rest }) => {
  const address = shortChecksumAddress(value)
=======
const RifAddress: FC<RifAddressProps> = ({
  pretext, value, disableChecksum, ...rest
}) => {
  const address = disableChecksum ? shortenString(value) : shortChecksumAddress(value)
>>>>>>> 4393fc1 (fix(storage): fixes visual defects + buggy mapping)

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
