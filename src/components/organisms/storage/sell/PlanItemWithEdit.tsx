import React, { FC, useState } from 'react'
import { StoragePlanItem } from 'context/Market/storage/interfaces'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { MarketCryptoRecord } from 'models/Market'
import EditablePlanItem from './EditablePlanItem'
import PlanItem from './PlanItem'

export interface PlanItemWithEditProps {
  planItem: StoragePlanItem
  fiatXR: number
  fiatDisplayName: string
  cryptoXRs: MarketCryptoRecord
}

const useStyles = makeStyles((theme: Theme) => ({
  planItem: {
    [theme.breakpoints.up('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}))

const PlanItemWithEdit: FC<PlanItemWithEditProps> = ({
  planItem, fiatXR, fiatDisplayName, cryptoXRs,
}) => {
  const classes = useStyles()
  const [editMode, setEditMode] = useState(false)

  const handleOnEditClick = () => setEditMode(true)

  const handleOnSaveClick = () => setEditMode(false)

  if (editMode) {
    return (
      <EditablePlanItem
        planItem={planItem}
        onPlanSaved={handleOnSaveClick}
        cryptoXRs={cryptoXRs}
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
