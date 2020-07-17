import React, { FC, useState } from 'react'
import { Button } from '@material-ui/core'
import EditablePlan, { EditablePlanProps } from '../../../molecules/storage/listing/EditablePlan'
import PlanItem, { PlanItemProps } from '../../../molecules/storage/listing/PlanItem'

export interface PlanItemEditableProps {
  editableProps: EditablePlanProps
  planItemProps: PlanItemProps
}

const PlanItemEditable: FC<PlanItemEditableProps> = ({ editableProps, planItemProps }) => {
  const [editMode, setEditMode] = useState(false)
  return (
    <>
      <Button onClick={() => setEditMode(!editMode)}>switch</Button>
      {
        editMode
        && (
          <EditablePlan {...editableProps} />
        )
      }
      {
        !editMode
        && (
          <PlanItem {...planItemProps} />
        )
      }
    </>
  )
}

export default PlanItemEditable
