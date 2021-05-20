import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'
import { SupportedTokenSymbol } from 'models/Token'
import React, { FC } from 'react'
import { getSupportedTokenByName } from 'utils/tokenUtils'

type Props = SelectProps & {
  options: SupportedTokenSymbol[]
  value: SupportedTokenSymbol
}

const CurrencySelect: FC<Props> = ({
  onChange, options, color = 'secondary', variant = 'standard', ...rest
}) => (
  <Select
    onChange={onChange}
    color={color}
    variant={variant}
    {...rest}
  >
    {options.map(
      (option: SupportedTokenSymbol) => (
        <MenuItem key={option as string} value={option}>
          {getSupportedTokenByName(option).displayName}
        </MenuItem>
      ),
    )}
  </Select>
)

export default CurrencySelect
