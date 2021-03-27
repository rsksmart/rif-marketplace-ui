import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { CopyTextTooltip, shortenString } from '@rsksmart/rif-ui'
import { TxHash } from 'context/Confirmations/interfaces'
import React, { FC } from 'react'

export type TransactionItemProps = {
  txHash: TxHash
  currentCount: number
  targetCount?: number
}

const useStyles = makeStyles(() => ({
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  progressCountContainer: {
    display: 'flex',
  },
  progressCount: {
    width: '100%',
  },
}))

const TransactionItem: FC<TransactionItemProps> = ({
  txHash, currentCount, targetCount,
}) => {
  const classes = useStyles()
  const renderProgress = (): JSX.Element => {
    if (currentCount && targetCount) {
      return (
        <>
          <Grid item xs={10}>
            <LinearProgress
              variant="determinate"
              value={(currentCount * 100) / targetCount}
            />
          </Grid>
          <Grid item xs={2} className={classes.progressCountContainer}>
            <Typography
              align="right"
              variant="caption"
              className={classes.progressCount}
            >
              {`${currentCount}/${targetCount}`}
            </Typography>
          </Grid>
        </>
      )
    }
    return (
      <Typography
        variant="caption"
      >
        Waiting for the first confirmation...
      </Typography>
    )
  }

  return (
    <Grid container>
      <Typography
        variant="caption"
        component="div"
      >
        {'Transaction '}
        <CopyTextTooltip
          displayElement={
            (
              <Box display="inline" fontWeight="fontWeightMedium">
                {shortenString(txHash)}
              </Box>
            )
          }
          fullText={txHash}
        />
      </Typography>
      <Grid container>
        <Grid item xs={3}>
          <CircularProgress color="primary" />
        </Grid>
        <Grid item xs={9} className={classes.progressContainer}>
          {renderProgress()}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TransactionItem
