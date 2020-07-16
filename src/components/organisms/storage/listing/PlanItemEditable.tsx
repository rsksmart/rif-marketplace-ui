import React, { FC, useState } from 'react'
import { StoragePlan } from 'models/marketItems/StorageItem'
import EditablePlan, { EditablePlanProps } from '../../../molecules/storage/listing/EditablePlan'
import PlanItem, { PlanItemProps } from '../../../molecules/storage/listing/PlanItem'
import { Button } from '@material-ui/core'

export interface PlanItemEditableProps {
  editableProps: EditablePlanProps
  planItemProps: PlanItemProps

  // planItemProps: 
  // availableMonths: number[]
  // contractLength: number
  // onContractLengthChange: (value: number) => void
  // onPlanSaved: (plan: StoragePlan) => void
}

const PlanItemEditable: FC<PlanItemEditableProps> = ({ editableProps, planItemProps }) => {
  const [editMode, setEditMode] = useState(false)
  return (
    <>
      <Button onClick={() => setEditMode(!editMode)}>switch</Button>
      {
        editMode &&
        (
          <EditablePlan {...editableProps} />
        )
      }
      {
        !editMode &&
        (
          <PlanItem {...planItemProps} />
        )
      }
    </>
  )
}

export default PlanItemEditable
