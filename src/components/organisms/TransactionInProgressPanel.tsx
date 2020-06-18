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

  const { state: { confirmations: { txHash, currentCt, targetCt } }, dispatch: bcDispatch }: BlockchainStoreProps = useContext(BlockchainStore)
  const { dispatch: mpDispatch } = useContext(MarketStore)

  useEffect(() => {
    if (currentCt && targetCt) {
      if (currentCt >= targetCt) {
        bcDispatch({
          type: BLOCKCHAIN_ACTIONS.SET_TX_HASH,
          payload: {
            txHash: undefined,
          } as any,
        })
      }
    }
  }, [currentCt, targetCt, bcDispatch])

  useEffect(() => {
    if (isPendingConfirm && !txHash) {
      mpDispatch({
        type: MARKET_ACTIONS.SET_PROG_STATUS,
        payload: {
          isProcessing: false,
        },
      })
    }
  }, [txHash, isPendingConfirm, mpDispatch])

  return (
    <div className={classes.content}>
      <Typography>{text}</Typography>
      {txHash && !currentCt && <Typography>{`Transaction ${shortenAddress(txHash)} is waiting for the first confirmation.`}</Typography>}
      {txHash && currentCt && <Typography>{`Transaction ${shortenAddress(txHash)} is waiting for confirmation ${currentCt + 1} or ${targetCt}.`}</Typography>}
      <CircularProgress />
      <Typography>{progMsg}</Typography>
    </div>
  )
}

export default TransactionInProgressPanel
