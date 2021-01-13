import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'
import Popover, { PopoverProps } from '@material-ui/core/Popover'
import React, { FC } from 'react'
import TransactionsList from './TransactionsList'

export type TransactionsPopoverProps = PopoverProps

const TransactionsPopover: FC<TransactionsPopoverProps> = ({
  onClose,
  ...popoverProps
}) => (
  // TODO: extract common styles from notifications popover, create a template to reuse
  <Popover
    id="transactions-menu"
    keepMounted
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    {...{ onClose }}
    {...popoverProps}
  >
    <Card
      // TODO: move to classes
      style={{
        minWidth: '240px',
        maxWidth: '400px',
      }}
    >
      <CardHeader
        title="Transactions"
        titleTypographyProps={{
          align: 'center',
          variant: 'subtitle2',
          color: 'secondary',
        }}
      />
      <Divider />
      <CardContent>
        <TransactionsList />
      </CardContent>
    </Card>
  </Popover>
)

export default TransactionsPopover
