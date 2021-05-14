import { GridProps } from '@material-ui/core'
import Grid from '@material-ui/core/Grid/Grid'
import React, { FC } from 'react'
import SelectRowButton, { SelectRowButtonProps } from './SelectRowButton'

type Props = GridProps & {
    disabled?: boolean
    actions: Array<SelectRowButtonProps>
}

const MarketplaceActionsCell: FC<Props> = ({
  actions,
  disabled,
  ...gridProps
}) => (
  <Grid
    container
    spacing={2}
    justify="flex-end"
    wrap="nowrap"
    {...gridProps}
  >
    {
        actions.map((action) => (
          <Grid item key={action.id}>
            <SelectRowButton
              disabled={disabled || action.disabled}
              variant="outlined"
              {...action}
            />
          </Grid>
        ))
    }
  </Grid>
)

export default MarketplaceActionsCell
