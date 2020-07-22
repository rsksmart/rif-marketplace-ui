import React, { FC } from 'react'
import { shortenString, CopyTextTooltip } from '@rsksmart/rif-ui'
import { Typography } from '@material-ui/core'

export interface DomainNameItemProps {
  value: string
}

const MAX_DISPLAYED_LENGTH = 30

// TODO: replace with ShortenTextTooltip
const DomainNameItem: FC<DomainNameItemProps> = ({ value }) => (
  <>
    {
      value.length > MAX_DISPLAYED_LENGTH
      && (
        <CopyTextTooltip
          displayElement={<Typography variant="body2">{shortenString(value, MAX_DISPLAYED_LENGTH, 25)}</Typography>}
          fullText={value}
        />
      )
    }
    {
      value.length <= MAX_DISPLAYED_LENGTH
      && <Typography variant="body2">{value}</Typography>
    }
  </>
)

export default DomainNameItem
