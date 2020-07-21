import React, { FC } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Save'

export interface SavePlanItemButtonProps {
  onSaveClick: () => void
  disabled: boolean
}

const SavePlanItemButton: FC<SavePlanItemButtonProps> = ({ onSaveClick, disabled = false }) => (
  <Tooltip title="Save plan">
    <span>
      <IconButton
        onClick={onSaveClick}
        disabled={disabled}
        color="primary"
      >
        <SaveIcon />
      </IconButton>
    </span>
  </Tooltip>
)

export default SavePlanItemButton
