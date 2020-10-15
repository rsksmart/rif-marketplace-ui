import React, { FC, useState } from 'react'
import { StorageBillingPlan } from 'context/Market/storage/interfaces'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { MarketCryptoRecord } from 'models/Market'
import EditableBillingPlan from './EditableBillingPlan'
import BillingPlan from './BillingPlan'

export interface BillingPlanWithEditProps {
  billingPlan: StorageBillingPlan
  fiatDisplayName: string
  cryptoXRs: MarketCryptoRecord
}

const useStyles = makeStyles((theme: Theme) => ({
  billingPlan: {
    [theme.breakpoints.up('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}))

const BillingPlanWithEdit: FC<BillingPlanWithEditProps> = ({
  billingPlan, fiatDisplayName, cryptoXRs,
}) => {
  const classes = useStyles()
  const [editMode, setEditMode] = useState(false)

  const handleOnEditClick = () => setEditMode(true)

  const handleOnSaveClick = () => setEditMode(false)

  if (editMode) {
    return (
      <EditableBillingPlan
        billingPlan={billingPlan}
        onPlanSaved={handleOnSaveClick}
        cryptoXRs={cryptoXRs}
        fiatDisplayName={fiatDisplayName}
      />
    )
  }

  return (
    <BillingPlan
      className={classes.billingPlan}
      billingPlan={billingPlan}
      cryptoXRs={cryptoXRs}
      fiatDisplayName={fiatDisplayName}
      onEditClick={handleOnEditClick}
    />
  )
}

export default BillingPlanWithEdit
