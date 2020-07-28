import React, { FC } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'

export interface TooltipIconButtonProps {
  tooltipTitle: string
  iconButtonProps: IconButtonProps
  // onClick?: () => void
  // disabled?: boolean
  icon: React.ReactNode
}

// TODO: move to rif-ui
const TooltipIconButton: FC<TooltipIconButtonProps> = ({
  tooltipTitle,
  iconButtonProps,
  // onClick, disabled = false,
  icon,
}) => (
  <Tooltip title={tooltipTitle}>
    <span>
      <IconButton color="primary" {...iconButtonProps}>
        {/* <IconButton onClick={onClick} disabled={disabled} color="primary"> */}
        {icon}
      </IconButton>
    </span>

  </Tooltip>
)

export default TooltipIconButton
