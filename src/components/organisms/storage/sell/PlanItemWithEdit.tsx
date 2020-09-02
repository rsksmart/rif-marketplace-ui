import React, { FC, useState } from 'react'
import { StoragePlanItem } from 'context/Services/storage/interfaces'
import EditablePlanItem from './EditablePlanItem'
import PlanItem from './PlanItem'
import { makeStyles, Theme } from '@material-ui/core/styles'

export interface PlanItemWithEditProps {
  planItem: StoragePlanItem
  fiatXR: number
  fiatDisplayName: string
}

const useStyles = makeStyles((theme: Theme) => ({
  planItem: {
    [theme.breakpoints.up('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
}))

const PlanItemWithEdit: FC<PlanItemWithEditProps> = ({ planItem, fiatXR, fiatDisplayName }) => {
  const classes = useStyles()
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
      className={classes.planItem}
      planItem={planItem}
      fiatXR={fiatXR}
      fiatDisplayName={fiatDisplayName}
      onEditClick={handleOnEditClick}
    />
  )
}

export default PlanItemWithEdit
