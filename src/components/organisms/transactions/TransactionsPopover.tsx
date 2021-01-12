import {
  Card, CardContent, CardHeader, Divider, Popover, PopoverProps, Typography,
} from '@material-ui/core'
import { shortenString } from '@rsksmart/rif-ui'
import { ConfirmationsContext } from 'context/Confirmations'
import React, { FC, useContext } from 'react'

export type TransactionsPopoverProps = PopoverProps

const TransactionsPopover: FC<TransactionsPopoverProps> = ({
  onClose,
  ...popoverProps
}) => {
  const {
    state: { confirmations },
  } = useContext(ConfirmationsContext)

  return (
    <Popover
      id="transactions-menu"
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...{ onClose }}
      {...popoverProps}
    >
      <Card>
        <CardHeader
          title="Transactions in progress"
          titleTypographyProps={{ variant: 'subtitle2', color: 'secondary' }}
        />
        <Divider />
        <CardContent>
          {
            Boolean(Object.keys(confirmations).length)
            && Object.keys(confirmations).map((txHash) => (
              <div key={Date.now()}>
                <Typography>
                  {`TxHash: ${shortenString(txHash)}`}
                </Typography>
                <Typography>
                  {`current: ${confirmations[txHash].currentCount}`}
                  {
                    confirmations[txHash].targetCount
                    && `target: ${confirmations[txHash].targetCount}`
                  }
                </Typography>
              </div>
            ))
          }
          {
            !Object.keys(confirmations).length
            && <Typography>No pending transactions!</Typography>
          }
        </CardContent>
      </Card>
    </Popover>
  )
}

export default TransactionsPopover
