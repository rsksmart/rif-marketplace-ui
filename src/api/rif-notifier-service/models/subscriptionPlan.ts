import { NotifierResponse } from 'api/rif-notifier-service/interfaces'

export type PlanStatusDTO =
    | 'ACTIVE'

export type PlanPriceDTO = {
    price: string
    currency: {
        name: string
        address: {
            value: string
            typeAsString: string
        }
    }
}

export type SubscriptionPlanDTO = {
    id: number
    name: string
    validity: number
    planStatus: PlanStatusDTO
    notificationPreferences: string[]
    notificationQuantity: number
    subscriptionPriceList: PlanPriceDTO[]
}

export type SubscriptionPlanResponse = NotifierResponse<Array<SubscriptionPlanDTO>>
