import { NotifierOfferItem, NotifierPlan } from 'models/marketItems/NotifierItem'

export interface NotifierOffersTransport {
    provider: string
    plans: NotifierPlan[]
}
class TransportModel implements NotifierOffersTransport {
    provider!: string

    plans!: NotifierPlan[]

    constructor({ provider, plans }: NotifierOffersTransport) {
      this.plans = plans
      this.provider = provider
    }

    public readonly toLocal = (): NotifierOfferItem => ({
      id: this.provider,
      plans: this.plans,
    })
}

export default TransportModel
