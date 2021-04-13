import { makeStyles } from '@material-ui/core'
import Accordion, { AccordionProps } from '@material-ui/core/Accordion'
import { colors } from '@rsksmart/rif-ui'
import ActiveContracts from 'components/molecules/plans/ActiveContracts'
import LabelWithValue from 'components/atoms/LabelWithValue'
import PlanViewSummary from 'components/molecules/plans/PlanViewSummary'
import Marketplace from 'components/templates/marketplace/Marketplace'
import React, {
  FC,
} from 'react'

const usePlanStyles = makeStyles({
  root: {
    width: '100%',
    border: `1px solid ${colors.gray3}`,
    borderRadius: 15,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&:last-child': {
      borderRadius: 15,
    },
    '&:first-child': {
      borderRadius: 15,
    },
  },
})

type Props = Omit<AccordionProps, 'children'> & {
  planSummary: {
      name: string
      left: { label: string, value: string}
      middle: { label: string, value: string}
      right: { label: string, value: string}
  }
  handlePlanEdit: () => void
  isPlanEditDisabled: boolean
  handlePlanCancel: () => void
  isPlanCancelDisabled: boolean
  isTableLoading: boolean
  headers: {
    customer: string
    limit: string
    expDate: string
    price: string
    funds: string
  }
  activeContracts: never[]
}

const PlanView: FC<Props> = ({
  planSummary: {
    name, left, middle, right,
  },
  handlePlanEdit,
  isPlanEditDisabled,
  handlePlanCancel,
  isPlanCancelDisabled,
  isTableLoading,
  headers,
  activeContracts,
}) => (
  <Accordion
    classes={usePlanStyles()}
  >
    <PlanViewSummary
      name={`Plan ${name}`}
      left={<LabelWithValue label={left.label} value={left.value} />}
      middle={<LabelWithValue label={middle.label} value={middle.value} />}
      right={<LabelWithValue label={right.label} value={right.value} />}
    />
    <ActiveContracts
      {...{
        handlePlanEdit,
        isPlanEditDisabled,
        handlePlanCancel,
        isPlanCancelDisabled,
      }}
    >
      <Marketplace
        isLoading={isTableLoading}
        headers={headers}
        items={activeContracts}
      />
    </ActiveContracts>
  </Accordion>
)

export default PlanView
