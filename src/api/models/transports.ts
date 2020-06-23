
export interface OfferTransport {
    creationDate?: string
    offerId: string
    paymentToken: string
    price: string
    ownerAddress: string
    ownerDomain: string
    tokenId: string
    domain: DomainTransport
}

export interface DomainTransport {
    expiration: {
        date: string
    }
    owner: {
        address: string
    }
    name: string
    tokenId: string
    offers?: Omit<OfferTransport, 'domain'>[]
}

export interface SoldDomainTransport {
    id: string
    tokenId: string
    paymentToken: string
    price: string
    soldDate: string
    domain: DomainTransport
    transfer: {
        sellerAddress: string
        buyerAddress: string
    }
}