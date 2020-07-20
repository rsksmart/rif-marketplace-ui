import React, { FC, useState } from 'react'
import { Button } from '@material-ui/core'
import EditablePlanItem, { EditablePlanItemProps } from '../../../molecules/storage/listing/EditablePlanItem'
import PlanItem, { PlanItemProps } from '../../../molecules/storage/listing/PlanItem'

export interface PlanItemEditableProps {
  editableProps: EditablePlanItemProps
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
          <EditablePlanItem {...editableProps} />
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
