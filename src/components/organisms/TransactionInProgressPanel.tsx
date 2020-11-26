import {
  CircularProgress, createStyles, makeStyles, Theme,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import React, {
  FC, useContext, useEffect,
} from 'react'
import BlockchainContext, { BlockchainContextProps } from 'context/Blockchain/BlockchainContext'
import OverlaidPageTemplate from 'components/templates/OverlaidPageTemplate'
import { shortChecksumAddress } from 'utils/stringUtils'

export interface TransactionInProgressPanelProps {
  text: string
  progMsg: string
  isPendingConfirm?: boolean
  onProcessingComplete?: () => void
  overlayed?: boolean
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
  progMsg, text, isPendingConfirm,
  onProcessingComplete = (): void => undefined,
  overlayed,
}) => {
  const classes = useStyles()

  const {
    state: { confirmations: { txHash, currentCount, targetCount } },
    dispatch: bcDispatch,
  }: BlockchainContextProps = useContext(BlockchainContext)

  useEffect(() => {
    if (currentCount && targetCount && currentCount >= targetCount) {
      bcDispatch({
        type: 'CLEAR_CONFIRMATIONS',
        payload: {} as never,
      })
    }
  }, [currentCount, targetCount, bcDispatch])

  useEffect(() => {
    if (isPendingConfirm && !txHash) {
      onProcessingComplete()
    }
  }, [txHash, isPendingConfirm, onProcessingComplete])

  const panelContent = (
    <div className={classes.content}>
      <Typography>{text}</Typography>
      {txHash && !currentCount && <Typography>{`Transaction ${shortChecksumAddress(txHash)} is waiting for the first confirmation.`}</Typography>}
      {txHash && currentCount && <Typography>{`Transaction ${shortChecksumAddress(txHash)} is waiting for confirmation ${currentCount + 1} of ${targetCount}.`}</Typography>}
      <CircularProgress />
      <Typography>{progMsg}</Typography>
    </div>
  )

  if (overlayed) {
    return (
      <OverlaidPageTemplate>
        {panelContent}
      </OverlaidPageTemplate>
    )
  }
  return panelContent
}

export default TransactionInProgressPanel
