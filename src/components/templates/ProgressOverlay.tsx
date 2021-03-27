import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import { JobDoneBox } from 'components/molecules'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import React, { FC } from 'react'
import OverlaidPageTemplate from './OverlaidPageTemplate'

import TxCompletePageTemplate from './TxCompletePageTemplate'

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
  if (inProgress || isDone) {
    return (
      <OverlaidPageTemplate>
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
                      key={String(btn.props.children)}
                    >
                      {btn}
                    </GridItem>
                  ))
                }
              </GridRow>
            </TxCompletePageTemplate>
          )
        }
      </OverlaidPageTemplate>
    )
  }
  return null
}

export default ProgressOverlay
export type ProgressOverlayProps = Props
