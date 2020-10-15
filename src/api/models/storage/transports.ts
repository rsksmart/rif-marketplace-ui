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
    availableFunds: string
    billingPeriod: number
    billingPrice: string
    consumer: string
    dataReference: string
    hasSufficientFunds: boolean
    isActive: boolean
    lastPayout: Date
    numberOfPrepaidPeriods: number
    offerId: string
    periodsSinceLastPayout: number
    size: string
    toBePayedOut: string
    tokenAddress: string
    expiresIn: string
}
