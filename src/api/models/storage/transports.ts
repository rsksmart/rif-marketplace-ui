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

export type AgreementTransport = {
    agreementReference: string
    dataReference: string
    consumer: string
    size: string
    isActive: boolean
    billingPeriod: string
    billingPrice: string
    tokenAddress: string
    availableFunds: string
}
