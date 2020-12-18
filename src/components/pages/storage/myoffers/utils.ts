import { StorageBillingPlan } from 'context/Market/storage/interfaces'

export const isBillingPlansChanged = (
  current: StorageBillingPlan[],
  previous: StorageBillingPlan[],
): boolean => {
  if (current.length !== previous.length) {
    return true
  }
  return previous.some(
    (plan) => !current.find(
      ({ period, price, currency }) => currency === plan.currency
              && period === plan.period
              && price.toString() === plan.price.toString(),
    ),
  )
}

export default { isBillingPlansChanged }
