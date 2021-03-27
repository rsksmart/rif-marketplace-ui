import React, { FC } from 'react'
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { makeStyles, Typography } from '@material-ui/core'
import { SupportedTokenSymbol } from 'models/Token'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { colors } from '@rsksmart/rif-ui'

type Props = ToggleButtonGroupProps & {
    options: SupportedTokenSymbol[]
}

const useStyles = makeStyles({
  root: {
    border: '1px solid',
    borderColor: colors.primary,
  },
  selected: {
    color: colors.primary,
    background: 'red',
  },
})

const CurrencyToggle: FC<Props> = ({
  options,
  value,
  ...props
}) => {
  const classes = useStyles()

  return (
    <ToggleButtonGroup
      className={classes.root}
      exclusive
      value={value}
      size="small"
      aria-label="currency options"
      {...props}
    >
      {options.map((symbol) => (
        <ToggleButton
          classes={{
            selected: classes.selected,
          }}
          value={symbol}
          aria-label={symbol}
          key={symbol}
        >
          <Typography style={symbol === value ? { // FIXME: a hack to insert the selected colour as MUI seems to be overriding our style overrides
            color: colors.primary,
          } : {}}
          >
            {SUPPORTED_TOKEN_RECORDS[symbol].displayName}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default CurrencyToggle
