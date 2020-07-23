import React, { FC } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

export interface TooltipIconButtonProps {
  tooltipTitle: string
  onClick?: () => void
  disabled?: boolean
  icon: React.ReactNode
}

// TODO: move to rif-ui
const TooltipIconButton: FC<TooltipIconButtonProps> = ({
  tooltipTitle, onClick, disabled = false, icon,
}) => (
  <Tooltip title={tooltipTitle}>
    <span>
      <IconButton onClick={onClick} disabled={disabled} color="primary">
        {icon}
      </IconButton>
    </span>

  </Tooltip>
)

export default TooltipIconButton
