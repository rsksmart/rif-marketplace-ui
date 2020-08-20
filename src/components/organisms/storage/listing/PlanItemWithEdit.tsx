import React, { FC, useState } from 'react'
import { StoragePlanItem } from 'store/Services/storage/interfaces'
import EditablePlanItem from './EditablePlanItem'
import PlanItem from './PlanItem'

export interface PlanItemWithEditProps {
  planItem: StoragePlanItem
  fiatXR: number
  fiatDisplayName: string
}

const PlanItemWithEdit: FC<PlanItemWithEditProps> = ({ planItem, fiatXR, fiatDisplayName }) => {
  const [editMode, setEditMode] = useState(false)

  const handleOnEditClick = () => {
    setEditMode(true)
  }

  const handleOnSaveClick = () => {
    setEditMode(false)
  }

  if (editMode) {
    return (
      <EditablePlanItem
        planItem={planItem}
        onPlanSaved={handleOnSaveClick}
        fiatXR={fiatXR}
        fiatDisplayName={fiatDisplayName}
      />
    )
  }

  return (
    <PlanItem
      planItem={planItem}
      fiatXR={fiatXR}
      fiatDisplayName={fiatDisplayName}
      onEditClick={handleOnEditClick}
    />
  )
}

export default PlanItemWithEdit
