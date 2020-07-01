import { Web3Store } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { Domain } from 'models/marketItems/DomainItem'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { RnsListing, RnsOrder, RnsState, RnsStoreProps } from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'
import { attachApiEventCallback } from './utils'

export type StoreName = 'rns_domains'
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
    storeID: "rns_domains",
    listing: {
        items: [],
        outdatedTokens: []
    },
    filters: {
        status: 'owned',
    },
}

const RnsDomainsStore = React.createContext({} as RnsDomainsStoreProps | any)
const domainsReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsDomainsStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(domainsReducer, initialState)
    const { state: { apis: { domains: service } } }: AppStoreProps = useContext(AppStore)
    const { filters, listing: { outdatedTokens } } = state as DomainsState
    const { state: { account } } = useContext(Web3Store)

    const [isConnected, setIsConnected] = useState(false)
    const [isOutdated, setIsOutdated] = useState(true)

    useEffect(() => {
        if (!isConnected) {
            setIsConnected(!!service.connect())
        }
    }, [isConnected, service])

    useEffect(() => {
        if (isConnected) {
            service.attachEvent('updated', attachApiEventCallback(dispatch))
            service.attachEvent('patched', attachApiEventCallback(dispatch))
            service.attachEvent('created', attachApiEventCallback(dispatch))
            service.attachEvent('removed', attachApiEventCallback(dispatch))
        }
    }, [isConnected, service])

    useEffect(() => {
        if (outdatedTokens.length) {
            setIsOutdated(true)
        }
    }, [outdatedTokens])

    useEffect(() => {
        if (account && isConnected && isOutdated && !outdatedTokens.length) {
            service.fetch({
                ...filters,
                ownerAddress: account,
            }).then((items) => {
                dispatch({
                    type: 'SET_LISTING',
                    payload: {
                        items,
                    },
                })
                setIsOutdated(false)
            })
        }
    }, [isConnected, filters, service, account, isOutdated, outdatedTokens])

    const value = { state, dispatch }
    return <RnsDomainsStore.Provider value={value}>{children}</RnsDomainsStore.Provider>
}

export default RnsDomainsStore