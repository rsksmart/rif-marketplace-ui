import React, { useContext, useEffect, useReducer, useState } from 'react'
import { RnsFilter } from 'api/models/RnsFilter'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { RnsListing, RnsOrder, RnsState, RnsStoreProps } from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'
import { attachApiEventCallback } from './utils'

export type StoreName = 'rns_offers'

export type Order = Modify<RnsOrder, {
    item: RnsDomainOffer
}>

export type Listing = Modify<RnsListing, {
    items: RnsDomainOffer[]
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
    const [isReady, setIsReady] = useState(false)
    const [isOutdated, setIsOutdated] = useState(true)

    const { state: { apis: { offers } } }: AppStoreProps = useContext(AppStore)
    const api = offers as unknown as OffersController

    if (!api.service) {
        api.connect()
    }

    const [state, dispatch] = useReducer(offersReducer, initialState)
    const { filters, listing: { outdatedTokens } } = state as RnsState

    useEffect(() => {
        const {
            service,
            attachEvent
        } = api
        if (service && !isReady) {
            attachEvent('updated', attachApiEventCallback(dispatch))
            attachEvent('patched', attachApiEventCallback(dispatch))
            attachEvent('created', attachApiEventCallback(dispatch))
            attachEvent('removed', attachApiEventCallback(dispatch))

            setIsReady(true)
        }
    }, [api, isReady])

    useEffect(() => {
        if (outdatedTokens.length) {
            setIsOutdated(true)
        }
    }, [outdatedTokens])

    useEffect(() => {
        const { fetch } = api
        if (isReady && isOutdated && !outdatedTokens.length) {
            fetch(filters).then((items) => {
                dispatch({
                    type: 'SET_LISTING',
                    payload: {
                        items,
                    },
                })
                setIsOutdated(false)
            })
        }
    }, [isReady, filters, api, isOutdated, outdatedTokens])

    useEffect(() => {
        const { fetch } = api
        if (isReady) {
            fetch(filters).then((items) => {
                dispatch({
                    type: 'SET_LISTING',
                    payload: {
                        items,
                    },
                })
                setIsOutdated(false)
            })
        }
    }, [isReady, filters, api])

    const value = { state, dispatch }
    return <RnsOffersStore.Provider value={value}>{children}</RnsOffersStore.Provider>
}

export default RnsOffersStore