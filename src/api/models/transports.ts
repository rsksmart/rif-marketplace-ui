export interface OfferTransport {
    creationDate?: string
    id: string
    txHash: string
    paymentToken: string
    priceString: string
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
    txHash: string
    tokenId: string
    transferId: string
    paymentToken: string
    priceString: string
    soldDate: string
    domain: DomainTransport
    transfer: {
        sellerAddress: string
        buyerAddress: string
    }
}

export type RnsTransport = OfferTransport | DomainTransport | SoldDomainTransport
