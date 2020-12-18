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
      (p) => p.currency === plan.currency
              && p.period === plan.period
              && p.price.toString() === plan.price.toString(),
    ),
  )
}

export default { isBillingPlansChanged }
