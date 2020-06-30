import { RnsFilter } from 'api/models/RnsFilter'
import { SoldDomain } from 'models/marketItems/DomainItem'
import React, { useReducer } from 'react'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { RnsListing, RnsOrder, RnsState, RnsStoreProps } from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'

export type StoreName = 'rns_sold_store'

export type RnsSoldOrder = Modify<RnsOrder, {
    item: SoldDomain
}>

export type RnsSoldListing = Modify<RnsListing, {
    items: SoldDomain[]
}>

export type RnsSoldState = Modify<RnsState, {
    listing: RnsSoldListing
    filters: Pick<RnsFilter, 'name'>
    order?: RnsSoldOrder
}>

export type RnsSoldStoreProps = Modify<RnsStoreProps, {
    state: RnsSoldState
}>

export const initialState: RnsSoldState = {
    storeID: 'rns_sold_store',
    listing: {
        items: [],
        outdatedTokens: []
    },
    filters: {
    },
}

const RnsSoldStore = React.createContext({} as RnsSoldStoreProps | any)
const soldDomainsReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(soldDomainsReducer, initialState)

    const value = { state, dispatch }
    return <RnsSoldStore.Provider value={value}>{children}</RnsSoldStore.Provider>


    // ito - introduce similar connection mechanism as in the BlockchainStoreProvider component
    // so I guess, we will have to introduce another flag here (connect or something) which would trigger a use effect
    // that will connect the service (AppStore -> state.apis.sold.connect)

    // Or the sold page can connect directly, and like we did before dispatch a CONNECT_SERVICE or rather SET_SERVICE_CONNECTED
}

export default RnsSoldStore