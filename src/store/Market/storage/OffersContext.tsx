import React from 'react'
import { MarketListing } from '../interfaces'
import { StorageItem } from 'models/marketItems/StorageItem'

export type StoreName = 'storage_offers'

export interface StorageOrder {

}

export interface OffersState {
    listing: MarketListing<StorageItem>
}

// export const initialState: OffersState = {
//     // listing:
// }

const StorageOffersContext = React.createContext({})



export default StorageOffersContext