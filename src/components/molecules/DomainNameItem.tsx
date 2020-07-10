import React, { FC } from 'react'
import { shortenString, CopyTextTooltip } from '@rsksmart/rif-ui'
import { Typography } from '@material-ui/core'

export interface DomainNameItemProps {
  value: string
}

const MAX_DISPLAYED_LENGTH = 20

const DomainNameItem: FC<DomainNameItemProps> = ({ value }) => {
  return (
    <React.Fragment>
      {
        value.length > MAX_DISPLAYED_LENGTH &&
        <CopyTextTooltip
          displayElement={<Typography variant='body2'>{shortenString(value, 20, 10)}</Typography>}
          fullText={value} />
      }
      {
        value.length <= MAX_DISPLAYED_LENGTH &&
        <Typography variant='body2'>{value}</Typography>
      }
    </React.Fragment>
  )
}

export default DomainNameItem
