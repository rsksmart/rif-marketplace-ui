import React from 'react'
import { CombinedPriceCell } from 'components/molecules'
import NotificationsBalance from 'components/molecules/notifier/NotificationsBalance'
import { MySubscription } from 'components/organisms/notifier/mypurchase/PurchasesTable'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { ExchangeRate } from 'context/Market/interfaces'
import MarketplaceAddressCell from 'components/molecules/MarketplaceAddressCell'
import ExpirationDate, { SubscriptionExpirationType } from 'components/molecules/ExpirationDate'
import { SUBSCRIPTION_STATUSES } from 'api/rif-notifier-service/models/subscriptions'
import { SUBSCRIPTION_STATUS } from 'api/rif-marketplace-cache/notifier/subscriptions/models'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import RoundBtn from 'components/atoms/RoundBtn'
import { PlanDTO, PLAN_STATUS } from 'api/rif-marketplace-cache/notifier/offers/models'

const EXPIRATION_WARNING_TRIGGER = 5
const CANT_RENEW_MESSAGE = 'Subscriptions renewal is available only for completed or expired purchases'

const getExpirationType = (
  { status, expirationDate }: Pick<NotifierSubscriptionItem, 'status' | 'expirationDate'>, plan: PlanDTO,
): SubscriptionExpirationType => {
  if (plan.planStatus === PLAN_STATUS.INACTIVE) return 'disabled'
  const daysLeft = Math.ceil(Math.abs(new Date().getTime() - expirationDate?.getTime()) / (60 * 60 * 24 * 1000))

  if (status !== SUBSCRIPTION_STATUS.ACTIVE || daysLeft <= 0) return 'blocked'

  if (daysLeft <= EXPIRATION_WARNING_TRIGGER) return 'warning'

  return 'normal'
}

const mapMyPurchases = <V extends Function, R extends Function>(
  { currentFiat, crypto }: ExchangeRate,
  { onView, onRenew }: {
    onView: V
    onRenew: R
  },
) => ({
    id,
    token,
    plan,
    notificationBalance,
    expirationDate,
    price,
    provider,
    status,
  }: NotifierSubscriptionItem):
    MySubscription => {
    const { rate, displayName } = crypto?.[token.symbol]
      || { rate: 0, displayName: '' }

    const expType = getExpirationType({ status, expirationDate }, plan)
    const { provider: providerAddress } = provider
    const canRenew = (
      status === SUBSCRIPTION_STATUSES.COMPLETED
      || status === SUBSCRIPTION_STATUSES.EXPIRED
    )

    const renewButton = (
      <RoundBtn
        onClick={(): void => onRenew(id)}
        disabled={!canRenew}
      >
        Renew
      </RoundBtn>
    )

    const renewAction = canRenew
      ? renewButton
      : (
        <Tooltip title={CANT_RENEW_MESSAGE}>
          <span>
            {renewButton}
          </span>
        </Tooltip>
      )

    return {
      id,
      subId: <MarketplaceAddressCell value={id} />,
      provider: <MarketplaceAddressCell value={providerAddress} />,
      notifications: (
        <NotificationsBalance
          balance={notificationBalance}
          limit={plan.quantity}
        />
      ),
      expirationDate: (
        <ExpirationDate
          date={expirationDate}
          type={expType}
        />
      ),
      price: <CombinedPriceCell
        disabled={expType === 'blocked'}
        price={price.toString()}
        priceFiat={price.times(rate).toString()}
        currency={displayName}
        currencyFiat={currentFiat.displayName}
        divider=""
      />,
      status: <Typography>{status}</Typography>,
      actions: (
        <Grid
          container
          spacing={2}
          justify="flex-end"
          wrap="nowrap"
        >
          <Grid item>
            {renewAction}
          </Grid>
          <Grid item>
            <RoundBtn onClick={(): void => onView(id)}>View</RoundBtn>
          </Grid>
        </Grid>
      ),
    }
  }

export default mapMyPurchases
