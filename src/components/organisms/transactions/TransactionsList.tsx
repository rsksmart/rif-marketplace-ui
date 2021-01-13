import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import { ConfirmationsContext } from 'context/Confirmations'
import React, { FC, useContext } from 'react'
import TransactionItem from './TransactionItem'

const TransactionsList: FC = () => {
  const {
    state: { confirmations },
  } = useContext(ConfirmationsContext)

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
