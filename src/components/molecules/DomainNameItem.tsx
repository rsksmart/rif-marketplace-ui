import React, { FC } from 'react'
import { shortenString, CopyTextTooltip } from '@rsksmart/rif-ui'

export interface DomainNameItemProps {
  value: string
}

const DomainNameItem: FC<DomainNameItemProps> = ({ value }) => {
  return (
    <React.Fragment>
      {value.length > 16 && <CopyTextTooltip displayElement={<p>{shortenString(value)}</p>} fullText={value} />}
      {value.length <= 16 && <p>{value}</p>}
    </React.Fragment>
  )
}

export default DomainNameItem
