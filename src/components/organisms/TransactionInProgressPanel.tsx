import {
  CircularProgress, createStyles, makeStyles, Theme,
} from '@material-ui/core'
import { shortenAddress, Typography } from '@rsksmart/rif-ui'
import React, {
  Dispatch, FC, useContext, useEffect,
} from 'react'
import BlockchainStore, { BlockchainStoreProps } from 'store/Blockchain/BlockchainStore'
import { StoreDispatcher, StorePayload } from 'store/storeUtils/interfaces'

export interface TransactionInProgressPanelProps {
  text: string
  progMsg: string
  isPendingConfirm?: boolean
  dispatch: Dispatch<StoreDispatcher<StorePayload>>
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

const TransactionInProgressPanel: FC<TransactionInProgressPanelProps> = ({
  progMsg, text, isPendingConfirm, dispatch,
}) => {
  const classes = useStyles()

  const { state: { confirmations: { txHash, currentCount, targetCount } }, dispatch: bcDispatch }: BlockchainStoreProps = useContext(BlockchainStore)

  useEffect(() => {
    if (currentCount && targetCount && currentCount >= targetCount) {
      bcDispatch({
        type: 'CLEAR_CONFIRMATIONS',
        payload: {} as any,
      })
    }
  }, [currentCount, targetCount, bcDispatch])

  useEffect(() => {
    if (isPendingConfirm && !txHash) {
      dispatch({
        type: 'SET_PROGRESS',
        payload: {
          isProcessing: false,
        },
      })
    }
  }, [txHash, isPendingConfirm, dispatch])

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
