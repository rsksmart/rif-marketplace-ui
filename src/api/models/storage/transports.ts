export interface BillingPlanTransport {
    id: number
    period: string
    price: string
    offerId: string
    createdAt: string
    updatedAt: string
}

export interface OfferTransport {
    peerId: string
    provider: string
    totalCapacity: string
    availableCapacity: string
    utilizedCapacity: string
    plans: BillingPlanTransport[]
    avgBillingPrice: number
    createdAt: string
    updatedAt: string
    acceptedCurrencies: string[]
}
