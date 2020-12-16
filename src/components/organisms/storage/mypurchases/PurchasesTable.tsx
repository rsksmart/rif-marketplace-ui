import {
  Grid, makeStyles, TableContainer, Theme,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import RoundBtn from 'components/atoms/RoundBtn'
import Marketplace from 'components/templates/marketplace/Marketplace'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import getConfirmationsFor from 'context/Confirmations/utils'
import MarketContext from 'context/Market/MarketContext'
import withWithdrawContext, { StorageWithdrawContext, StorageWithdrawContextProps } from 'context/storage/mypurchases/withdraw'
import { Agreement } from 'models/marketItems/StorageItem'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import DetailsModal from '../agreements/DetailsModal'
import { AgreementCustomerView, AgreementView, createCustomerItemFields } from '../agreements/utils'

export type PurchasesProps = {
  agreements: Agreement[]
  onRenewAgreement: (agreement: Agreement) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  noAgreements: {
    margin: theme.spacing(3),
  },
}))

const PurchasesTable: FC<PurchasesProps> = (
  { agreements, onRenewAgreement },
) => {
  const classes = useStyles()
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)

  const {
    state: {
      status: {
        inProgress, isDone,
      },
      agreement: selectedAgreement,
    },
    dispatch: withdrawDispatch,
    asyncActions: {
      withdraw: withdrawAction,
    },
  } = useContext<StorageWithdrawContextProps>(StorageWithdrawContext)

  const {
    state: {
      confirmations,
    },
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)

  const [
    itemDetails,
    setItemDetails,
  ] = useState<AgreementCustomerView | undefined>(undefined)

  useEffect(() => {
    // hides modal on tx operation done
    if (isDone && itemDetails) {
      setItemDetails(undefined)
    }
  }, [isDone, itemDetails])

  if (!agreements.length) {
    return (
      <Typography
        className={classes.noAgreements}
        align="center"
        color="secondary"
      >
        No purchases yet
      </Typography>
    )
  }

  const withdrawConfirmationCount = getConfirmationsFor(
    'AGREEMENT_WITHDRAW', confirmations,
  ).length

  const headers = {
    title: 'Title',
    provider: 'Provider',
    contentSize: 'Content size',
    renewalDate: 'Renewal date',
    subscriptionPeriod: 'Subscription type',
    monthlyFee: 'Monthly fee',
    renew: '',
    view: '',
  }

  const items = createCustomerItemFields(
    agreements,
    crypto,
    currentFiat,
    (_, agreement: Agreement) => {
      onRenewAgreement(agreement)
    },
    (_, agreementView: AgreementView, agreement: Agreement) => {
      setItemDetails(agreementView as AgreementCustomerView)
      withdrawDispatch({
        type: 'SET_AGREEMENT',
        payload: agreement,
      })
    },
  )
  const modalActions = (): JSX.Element => {
    const isEnabled = Boolean(selectedAgreement?.withdrawableFunds.toNumber())
    return (
      <Grid container justify="center">
        <RoundBtn
          disabled={!isEnabled}
          onClick={
            (): void => {
              withdrawDispatch({
                type: 'SET_AGREEMENT',
                payload: selectedAgreement as Agreement,
              })
              withdrawAction()
            }
          }
        >
          Withdraw funds
        </RoundBtn>
        {
          isEnabled && (
            <Typography variant="caption" color="secondary" align="center">
              Withdrawing your funds would terminate the agreement
            </Typography>
          )
        }
      </Grid>
    )
  }

  const handleTxCompletedClose = (): void => {
    withdrawDispatch({
      type: 'SET_STATUS',
      payload: {
        inProgress: false,
      },
    })
    setItemDetails(undefined)
  }

  return (
    <>
      <TableContainer>
        <Marketplace
          headers={headers}
          isLoading={Boolean(withdrawConfirmationCount)}
          items={items}
        />
      </TableContainer>

      <DetailsModal
        modalProps={{
          open: Boolean(itemDetails),
          onBackdropClick: (): void => setItemDetails(undefined),
          onEscapeKeyDown: (): void => setItemDetails(undefined),
        }}
        itemDetails={itemDetails}
        actions={modalActions}
      />
      <ProgressOverlay
        isDone={isDone}
        doneMsg="Your funds have been withdrawed!"
        inProgress={inProgress}
        buttons={[
          <RoundBtn
            onClick={handleTxCompletedClose}
          >
            Close
          </RoundBtn>,
        ]}
        title="Withdrawing your funds"
      />
    </>
  )
}

export default withWithdrawContext(PurchasesTable)
