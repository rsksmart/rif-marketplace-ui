import { RnsFilter } from 'api/models/RnsFilter'
import { Domain } from 'models/marketItems/DomainItem'
import React, { useReducer } from 'react'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { RnsListing, RnsOrder, RnsState, RnsStoreProps } from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'

export type StoreName = 'rns_domains_store'

export type Order = Modify<RnsOrder, {
    item: Domain
}>

export type Listing = Modify<RnsListing, {
    items: Domain[]
}>

export type DomainsState = Modify<RnsState, {
    listing: Listing
    filters: Pick<RnsFilter, 'name' | 'status'>
    order?: Order
}>

export type RnsDomainsStoreProps = Modify<RnsStoreProps, {
    state: DomainsState
}>

export const initialState: DomainsState = {
    storeID: "rns_domains_store",
    listing: {
        items: [],
        outdatedTokens: []
    },
    filters: {
    },
}

const RnsDomainsStore = React.createContext({} as RnsDomainsStoreProps | any)
const domainsReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(domainsReducer, initialState)

    const value = { state, dispatch }
    return <RnsDomainsStore.Provider value={value}>{children}</RnsDomainsStore.Provider>


    // ito - introduce similar connection mechanism as in the BlockchainStoreProvider component
    // so I guess, we will have to introduce another flag here (connect or something) which would trigger a use effect
    // that will connect the service (AppStore -> state.apis.domains.connect)

    // Or the domains page can connect directly, and like we did before dispatch a CONNECT_SERVICE or rather SET_SERVICE_CONNECTED
}

export default RnsDomainsStore