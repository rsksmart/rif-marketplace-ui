import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { colors, fonts, Web3Store } from '@rsksmart/rif-ui'
import BillingPlanWithEdit from 'components/organisms/storage/sell/BillingPlanWithEdit'
import MarketContext from 'context/Market'
import { StorageBillingPlan } from 'context/Market/storage/interfaces'
import { storageSupportedTokens } from 'contracts/config'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { StorageContract } from 'contracts/storage'
import { MarketCryptoRecord } from 'models/Market'
import { BillingPlan, PeriodInSeconds } from 'models/marketItems/StorageItem'
import { SupportedTokenSymbol } from 'models/Token'
import React, { FC, useContext } from 'react'
import Web3 from 'web3'
import EditableBillingPlan from './EditableBillingPlan'

const useStyles = makeStyles((theme: Theme) => ({
  editablePlanContainer: {
    marginBottom: theme.spacing(4),
  },
  plansList: {
    marginTop: theme.spacing(2),
    borderTop: `1px solid ${colors.gray3}`,
    padding: theme.spacing(3, 0),
  },
  listTitle: {
    fontSize: fonts.size.medium,
    marginRight: theme.spacing(1),
  },
  listTitleContainer: {
    marginBottom: theme.spacing(2),
  },
}))

type BillingPlansListProps = {
  billingPlans: StorageBillingPlan[]
  onItemRemoved: (billingPlan: StorageBillingPlan) => void
  onItemAdded: (billingPlan: StorageBillingPlan) => void
  onItemSaved: (billingPlan: StorageBillingPlan) => void
}

const BillingPlansList: FC<BillingPlansListProps> = (
  {
    billingPlans, onItemRemoved, onItemAdded, onItemSaved,
  },
) => {
  const classes = useStyles()
  const {
    state: { account, web3 },
  } = useContext(Web3Store)
  const storageContract = StorageContract.getInstance(web3 as Web3)

  const {
    state: {
      exchangeRates: {
        currentFiat: { displayName: fiatDisplayName },
        crypto: cryptoXRs,
      },
    },
  } = useContext(MarketContext)

  const availableXRTokens: MarketCryptoRecord = Object.keys(cryptoXRs)
    .reduce((acc, symbol) => {
      if (storageSupportedTokens.includes(symbol as SupportedTokenSymbol)
        && storageContract.isWhitelistedToken(
          SUPPORTED_TOKEN_RECORDS[symbol],
          { from: account },
        )) {
        acc[symbol] = cryptoXRs[symbol]
      }

      return acc
    }, {} as MarketCryptoRecord)

  return (
    <>
      <Grid className={classes.editablePlanContainer} item xs={12}>
        <EditableBillingPlan
          cryptoXRs={cryptoXRs}
          fiatDisplayName={fiatDisplayName}
          onPlanAdded={onItemAdded}
        />
      </Grid>
      {/* STORAGE PLANS */}
      {
        Boolean(billingPlans.length)
        && (
          <Grid className={classes.plansList} item xs={12}>
            <Grid container className={classes.listTitleContainer}>
              <Typography
                className={classes.listTitle}
                gutterBottom
                display="inline"
              >
                Storage plans added
              </Typography>
              <Typography display="inline" color="secondary">
                All storage plans below will be listed in the marketplace once you click in List storage.
              </Typography>
            </Grid>
            <Grid alignItems="center" container spacing={2}>
              {
                billingPlans.sort(
                  ({ period: a }: BillingPlan, { period: b }: BillingPlan) => (
                    PeriodInSeconds[a] - PeriodInSeconds[b]
                  ),
                ).map(
                  (billingPlan: StorageBillingPlan) => (
                    <Grid item xs={12} key={billingPlan.internalId}>
                      <BillingPlanWithEdit
                        cryptoXRs={availableXRTokens}
                        fiatDisplayName={fiatDisplayName}
                        billingPlan={billingPlan}
                        onRemoveClick={(): void => onItemRemoved(billingPlan)}
                        onSaveClick={onItemSaved}
                      />
                    </Grid>
                  ),
                )
              }
            </Grid>
          </Grid>
        )
      }
    </>
  )
}

export default BillingPlansList
