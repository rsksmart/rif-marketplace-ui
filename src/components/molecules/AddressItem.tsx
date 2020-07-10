import { shortenString, CopyTextTooltip } from '@rsksmart/rif-ui'
import React, { FC } from 'react'

export interface AddressItemProps {
  pretext?: string
  value: string
}

const AddressItem: FC<AddressItemProps> = ({ pretext, value }) => {
  const displayElement = (
    <p>
      {pretext && `${pretext} (${shortenString(value)})`}
      {!pretext && shortenString(value)}
    </p>
  )
  return <CopyTextTooltip fullText={value} displayElement={displayElement} />
}

export default AddressItem
