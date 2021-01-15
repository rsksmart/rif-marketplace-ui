import { makeStyles, Theme } from '@material-ui/core/styles'
import { PopoverProps } from '@material-ui/core/Popover'
import PopoverCardTemplate from 'components/templates/PopoverCardTemplate'
import { ConfirmationsRecord } from 'context/Confirmations/interfaces'
import React, { FC } from 'react'
import TransactionsList from './TransactionsList'

export type TransactionsPopoverProps = PopoverProps & {
  confirmations: ConfirmationsRecord
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    minWidth: theme.spacing(30),
    maxWidth: theme.spacing(50),
  },
}))

const TransactionsPopover: FC<TransactionsPopoverProps> = ({
  confirmations,
  onClose,
  ...popoverProps
}) => {
  const classes = useStyles()
  return (
    <PopoverCardTemplate
      id="transactions-menu"
      cardTitle="Transactions"
      cardClassName={classes.card}
      onClose={onClose}
      {...popoverProps}
    >
      <TransactionsList confirmations={confirmations} />
    </PopoverCardTemplate>
  )
}

export default TransactionsPopover
