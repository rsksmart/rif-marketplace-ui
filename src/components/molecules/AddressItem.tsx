import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { shortenString, CopyTextTooltip } from '@rsksmart/rif-ui'
import React, { FC } from 'react'

export interface AddressItemProps extends TypographyProps {
  pretext?: string
  value: string
}

const AddressItem: FC<AddressItemProps> = ({ pretext, value, ...rest }) => {
  const displayElement = (
    <Typography {...rest}>
      {pretext && `${pretext} (${shortenString(value)})`}
      {!pretext && shortenString(value)}
    </Typography>
  )
  return <CopyTextTooltip fullText={value} displayElement={displayElement} />
}

export default AddressItem
