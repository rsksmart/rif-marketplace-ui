import { makeStyles } from '@material-ui/core'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import { JobDoneBox } from 'components/molecules'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import React, { FC } from 'react'

import TxCompletePageTemplate from './TxCompletePageTemplate'

const useStyle = makeStyles(() => ({
  progressContainer: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed',
    width: '100vw',
    top: 0,
    left: 0,
    zIndex: 999,
  },
}))

export type Status = {
  inProgress?: boolean
  isDone?: boolean
}

type Props = Status & {
  title: string
  buttons: JSX.Element[]
  doneMsg: string
}

const ProgressOverlay: FC<Props> = ({
  inProgress,
  isDone,
  buttons,
  title,
  doneMsg,
}) => {
  const classes = useStyle()

  if (inProgress || isDone) {
    return (
      <div className={classes.progressContainer}>
        {
          inProgress && (
            <TransactionInProgressPanel
              text={title}
              progMsg="The waiting period is required to securely complete your transaction.
              Please do not close this tab until the process has finished."
            />
          )
        }
        {
          isDone && (
            <TxCompletePageTemplate>
              <JobDoneBox text={doneMsg} />
              <GridRow justify="center">
                {
                  buttons.map((btn) => (
                    <GridItem
                      key={btn.key || (btn as unknown as HTMLElement).innerText}
                    >
                      {btn}
                    </GridItem>
                  ))
                }
              </GridRow>
            </TxCompletePageTemplate>
          )
        }
      </div>
    )
  }
  return null
}

export default ProgressOverlay
