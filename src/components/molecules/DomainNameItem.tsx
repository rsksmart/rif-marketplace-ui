import React, { FC } from 'react'
import { shortenString, CopyTextTooltip } from '@rsksmart/rif-ui'

export interface DomainNameItemProps {
  value: string
}

const MAX_DISPLAYED_LENGTH = 20

const DomainNameItem: FC<DomainNameItemProps> = ({ value }) => {
  return (
    <React.Fragment>
      {value.length > MAX_DISPLAYED_LENGTH && <CopyTextTooltip displayElement={<p>{shortenString(value, 20, 10)}</p>} fullText={value} />}
      {value.length <= MAX_DISPLAYED_LENGTH && <p>{value}</p>}
    </React.Fragment>
  )
}

export default DomainNameItem
