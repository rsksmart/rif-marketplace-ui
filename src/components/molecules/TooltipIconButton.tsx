import React, { FC } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'

export interface TooltipIconButtonProps {
  tooltipTitle: string
  iconButtonProps: IconButtonProps
  icon: React.ReactNode
}

// TODO: move to rif-ui
const TooltipIconButton: FC<TooltipIconButtonProps> = ({
  tooltipTitle,
  iconButtonProps,
  icon,
}) => (
  <Tooltip title={tooltipTitle}>
    <span>
      <IconButton color="primary" {...iconButtonProps}>
        {icon}
      </IconButton>
    </span>

  </Tooltip>
)

export default TooltipIconButton
