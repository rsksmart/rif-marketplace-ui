import React, { FC } from 'react'
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { Typography } from '@material-ui/core'
import { SupportedTokenSymbol } from 'models/Token'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'

type Props = ToggleButtonGroupProps & {
    options: SupportedTokenSymbol[]
}

const CurrencyToggle: FC<Props> = ({
  options,
  ...props
}) => (
  <ToggleButtonGroup
    exclusive
    aria-label="currency options"
    {...props}
  >
    {options.map((symbol) => (
      <ToggleButton value={symbol} aria-label={symbol}>
        <Typography>{SUPPORTED_TOKEN_RECORDS[symbol].displayName}</Typography>
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
)

export default CurrencyToggle
