import React, { useContext, useEffect, useReducer, useState } from 'react'
import { RnsFilter } from 'api/models/RnsFilter'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import { DomainOffer } from 'models/marketItems/DomainItem'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { RnsListing, RnsOrder, RnsState, RnsStoreProps } from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'
import { attachApiEventCallback } from './utils'

export type StoreName = 'rns_offers'

export type Order = Modify<RnsOrder, {
    item: DomainOffer
}>

export type Listing = Modify<RnsListing, {
    items: DomainOffer[]
}>

export type OffersState = Modify<RnsState, {
    listing: Listing
    filters: Pick<RnsFilter, 'name' | 'price'>
    order?: Order
}>

export type RnsOffersStoreProps = Modify<RnsStoreProps, {
    state: OffersState
}>

export const initialState: OffersState = {
    storeID: "rns_offers",
    listing: {
        items: [],
        outdatedTokens: []
    },
    filters: {
        price: {
            min: 0,
            max: 0
        }
    },
}

const RnsOffersStore = React.createContext({} as RnsOffersStoreProps | any)
const offersReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsOffersStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(offersReducer, initialState)
    const { state: { apis: { offers } } }: AppStoreProps = useContext(AppStore)
    const { filters, listing: { outdatedTokens } } = state as RnsState
    const service = offers as unknown as OffersController

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
        if (isConnected && isOutdated && !outdatedTokens.length) {
            service.fetchPriceLimits().then(price => {
                dispatch({
                    type: 'FILTER',
                    payload: { price }
                })
                service.fetch(filters).then((items) => {
                    dispatch({
                        type: 'SET_LISTING',
                        payload: {
                            items,
                        },
                    })
                    setIsOutdated(false)
                })
            })
        }
    }, [isConnected, filters, service, isOutdated, outdatedTokens])

    const value = { state, dispatch }
    return <RnsOffersStore.Provider value={value}>{children}</RnsOffersStore.Provider>
}

export default RnsOffersStore