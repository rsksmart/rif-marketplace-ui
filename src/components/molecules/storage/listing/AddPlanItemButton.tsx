import React, { FC } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'

export interface AddPlanItemButtonProps {
  onAddClick: () => void
  disabled: boolean
}

const AddPlanItemButton: FC<AddPlanItemButtonProps> = ({ onAddClick, disabled = false }) => (
  <Tooltip title="Add plan">
    <span>
      <IconButton
        onClick={onAddClick}
        disabled={disabled}
        color="primary"
      >
        <AddIcon />
      </IconButton>
    </span>
  </Tooltip>

)

export default AddPlanItemButton
