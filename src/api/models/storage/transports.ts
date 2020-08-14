export interface BillingPlanTransport {
    id: number
    period: string
    price: string
    offerId: string
    createdAt: string
    updatedAt: string
}

export interface OfferTransport {
    peerId: string | null
    provider: string
    totalCapacity: string
    availableCapacity: string
    utilizedCapacity: string
    plans: BillingPlanTransport[]
    createdAt: string
    updatedAt: string
}
