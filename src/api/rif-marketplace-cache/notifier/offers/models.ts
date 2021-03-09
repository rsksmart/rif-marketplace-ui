import { NotifierOfferItem, NotifierPlan } from 'models/marketItems/NotifierItem'

export type TransportModelType = {
    provider: string
    plans: NotifierPlan[]
}
class TransportModel implements TransportModelType {
    provider!: string

    plans!: NotifierPlan[]

    constructor({ provider, plans }: TransportModelType) {
      this.plans = plans
      this.provider = provider
    }

    public readonly toLocal = (): NotifierOfferItem => ({
      id: this.provider,
      plans: this.plans,
    })
}

export default TransportModel
