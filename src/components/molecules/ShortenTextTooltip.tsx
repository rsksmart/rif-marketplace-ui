import React, { FC } from 'react'
import { shortenString, CopyTextTooltip } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'

export interface ShortenTextTooltipProps {
  value: string
  maxLength?: number
}

const ShortenTextTooltip: FC<ShortenTextTooltipProps> = ({ value, maxLength = 20 }) => (
  <>
    {
      value.length > maxLength
      && (
        <CopyTextTooltip
          displayElement={<Typography variant="body2">{shortenString(value, maxLength)}</Typography>}
          fullText={value}
        />
      )
    }
    {
      value.length <= maxLength
      && value
    }
  </>
)

export default ShortenTextTooltip
