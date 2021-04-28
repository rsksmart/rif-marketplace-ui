import React, { useState } from 'react'
import { makeStyles, TableContainer, Typography } from '@material-ui/core'
import Accordion, { AccordionProps } from '@material-ui/core/Accordion'
import { colors } from '@rsksmart/rif-ui'
import ActiveContracts from 'components/molecules/plans/ActiveContracts'
import PlanViewSummary, { PlanViewSummaryProps } from 'components/molecules/plans/PlanViewSummary'
import Marketplace, { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'

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

type Props<H extends TableHeaders> = Omit<AccordionProps, 'children'> & {
  summary: Omit<PlanViewSummaryProps, 'isExpanded'>
  handlePlanEdit: () => void
  isPlanEditDisabled: boolean
  handlePlanCancel: () => void
  isPlanCancelDisabled: boolean
  isTableLoading: boolean
  headers: H
  activeContracts: Array<Pick<MarketplaceItem, 'id'> & {
    [K in keyof H]: any
  }>
}

const PlanView = <H extends TableHeaders>({
  summary: { name, ...summaryProps },
  handlePlanEdit,
  isPlanEditDisabled,
  handlePlanCancel,
  isPlanCancelDisabled,
  isTableLoading,
  headers,
  activeContracts,
  ...accordionProps
}: Props<H>): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasActiveContracts = Boolean(activeContracts.length)

  return (
    <Accordion
      classes={usePlanStyles()}
      expanded={isExpanded}
      onChange={() => { setIsExpanded(!isExpanded) }}
      {...accordionProps}
    >
      <PlanViewSummary
        name={`Plan ${name}`}
        isExpanded={isExpanded}
        {...summaryProps}
      />
      <ActiveContracts
        {...{
          handlePlanEdit,
          isPlanEditDisabled,
          handlePlanCancel,
          isPlanCancelDisabled,
        }}
      >
        {
        !hasActiveContracts
        && (
        <Typography
          align="center"
          color="secondary"
          style={{ paddingLeft: '16px' }}
        >
          No active contracts yet
        </Typography>
        )
      }
        {
        hasActiveContracts
        && (
        <TableContainer>
          <Marketplace
            isLoading={isTableLoading}
            headers={headers}
            items={activeContracts}
          />
        </TableContainer>
        )
      }
      </ActiveContracts>
    </Accordion>
  )
}

export default PlanView
