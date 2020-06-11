import { Tooltip } from '@material-ui/core'
import { shortenAddress } from '@rsksmart/rif-ui'
import React, { FC, useState } from 'react'

export interface AddressItemProps {
  pretext?: string
  value: string
}

const AddressItem: FC<AddressItemProps> = ({ pretext, value }) => {
  const [isCopied, setIsCopied] = useState(false)
  return (
    <Tooltip
      interactive
      title={isCopied ? 'Copied!' : value}
      onClick={() => {
        navigator.clipboard.writeText(value)
          .then(() => { setIsCopied(true) })
      }}
      onClose={() => {
        setIsCopied(false)
      }}
    >
      <p>
        {pretext && `${pretext} (${shortenAddress(value)})`}
        {!pretext && shortenAddress(value)}
      </p>
    </Tooltip>
  )
}

export default AddressItem
