import { BillingPlan } from 'models/marketItems/StorageItem'

export const isBillingPlansChange = (
  current: BillingPlan[],
  previous: BillingPlan[],
): boolean => {
  if (current.length !== previous.length) {
    return true
  }
  return previous.some(
    (plan) => !current.find(
      ({ period, price, currency }) => currency === plan.currency &&
              period === plan.period &&
              price.toString() === plan.price.toString(),
    ),
  )
}

export default { isBillingPlansChange }
