
export interface MarketOrder<T> {
    item: T
    isProcessing: boolean
    isOutdated: boolean
}

export interface MarketListing<T> {
    items: T[]
    outdatedTokens: []
}