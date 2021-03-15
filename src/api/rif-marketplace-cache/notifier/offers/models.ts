import { NotifierPlan } from 'models/marketItems/NotifierItem'

interface Model {
    provider: string
    plans: NotifierPlan[]
}
class TransportModel implements Model {
    provider!: string

    plans!: NotifierPlan[]

    constructor({ provider, plans }: Model) {
      this.plans = plans
      this.provider = provider
    }

    get toLocal() {
      return {
        id: this.provider,
        plans: this.plans,
      }
    }
}

export default TransportModel
