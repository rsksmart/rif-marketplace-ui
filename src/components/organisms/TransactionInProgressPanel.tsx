import React, { FC, useContext, useEffect } from 'react'
import {
  CircularProgress, createStyles, makeStyles, Theme,
} from '@material-ui/core'
import { Typography, shortenAddress } from '@rsksmart/rif-ui'
import BlockchainStore, { BlockchainStoreProps } from 'store/Blockchain/BlockchainStore'
import MarketStore from 'store/Market/MarketStore'
import { BLOCKCHAIN_ACTIONS } from 'store/Blockchain/blockchainActions'
import { MARKET_ACTIONS } from 'store/Market/marketActions'

export interface TransactionInProgressPanelProps {
  text: string
  progMsg: string
  isPendingConfirm?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  content: {
    width: '100%',
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
}))

const TransactionInProgressPanel: FC<TransactionInProgressPanelProps> = ({ progMsg, text, isPendingConfirm }) => {
  const classes = useStyles()

  const { state: { confirmations: { txHash, currentCount, targetCount } }, dispatch: bcDispatch }: BlockchainStoreProps = useContext(BlockchainStore)
  const { dispatch: mDispatch } = useContext(MarketStore)

  useEffect(() => {
    if (currentCount && targetCount && currentCount >= targetCount) {
      bcDispatch({
        type: BLOCKCHAIN_ACTIONS.CLEAR_CONFIRMATIONS,
        payload: {} as any,
      })
    }
  }, [currentCount, targetCount, bcDispatch])

  useEffect(() => {
    if (isPendingConfirm && !txHash) {
      mDispatch({
        type: MARKET_ACTIONS.SET_PROG_STATUS,
        payload: {
          isProcessing: false,
        },
      })
    }
  }, [txHash, isPendingConfirm, mDispatch])

  return (
    <div className={classes.content}>
      <Typography>{text}</Typography>
      {txHash && !currentCount && <Typography>{`Transaction ${shortenAddress(txHash)} is waiting for the first confirmation.`}</Typography>}
      {txHash && currentCount && <Typography>{`Transaction ${shortenAddress(txHash)} is waiting for confirmation ${currentCount + 1} of ${targetCount}.`}</Typography>}
      <CircularProgress />
      <Typography>{progMsg}</Typography>
    </div>
  )
}

export default TransactionInProgressPanel
