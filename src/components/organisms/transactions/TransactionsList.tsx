import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import { ConfirmationsRecord } from 'context/Confirmations/interfaces'
import React, { FC } from 'react'
import TransactionItem from './TransactionItem'

type TransactionsListProps = {
  confirmations: ConfirmationsRecord
}

const TransactionsList: FC<TransactionsListProps> = ({ confirmations }) => {
  if (Object.keys(confirmations).length) {
    return (
      <List>
        {
          Object.keys(confirmations).map((txHash, i) => (
            <>
              {Boolean(i) && <Divider />}
              <ListItem>
                <TransactionItem
                  key={txHash}
                  txHash={txHash}
                  currentCount={confirmations[txHash].currentCount}
                  targetCount={confirmations[txHash].targetCount}
                />
              </ListItem>
            </>
          ))
        }
      </List>
    )
  }

  return (
    <Typography
      variant="caption"
      align="center"
    >
      No pending transactions!
    </Typography>
  )
}

export default TransactionsList
