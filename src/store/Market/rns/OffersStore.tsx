import { RnsFilter } from 'api/models/RnsFilter'
import { DomainOffer } from 'models/marketItems/DomainItem'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { MARKET_ACTIONS } from '../marketActions'
import MarketStore from '../MarketStore'
import { RnsListing, RnsOrder, RnsState, RnsStoreProps } from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'

export type StoreName = 'rns_offers_store'

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
    storeID: "rns_offers_store",
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


const apiEventCallback = (dispatch) => ({ tokenId }) => {
    dispatch({ type: 'REFRESH_TOKENS', payload: { tokenId } })
}

export const RnsStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(offersReducer, initialState)
    const { state: { apis: { offers } } }: AppStoreProps = useContext(AppStore)
    const { filters } = state as RnsState;

    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!isConnected) {
            setIsConnected(!!offers.connect())
        }
    }, [isConnected, offers])


    useEffect(() => {
        if (isConnected) {
            offers.attachEvent('updated', apiEventCallback(dispatch))
            offers.attachEvent('patched', apiEventCallback(dispatch))
            offers.attachEvent('created', apiEventCallback(dispatch))
            offers.attachEvent('removed', apiEventCallback(dispatch))
        }
    }, [isConnected, offers])

    useEffect(() => {
        if (isConnected) {
            offers.fetch(filters).then((items) => {
                dispatch({
                    type: 'SET_LISTING',
                    payload: {
                        items,
                    },
                })
            })
        }
    }, [isConnected, filters, offers])

    const value = { state, dispatch }
    return <RnsOffersStore.Provider value={value}>{children}</RnsOffersStore.Provider>


    // ito - introduce similar connection mechanism as in the BlockchainStoreProvider component
    // so I guess, we will have to introduce another flag here (connect or something) which would trigger a use effect
    // that will connect the service (AppStore -> offers.apis.sold.connect)

    // Or the offers page can connect directly, and like we did before dispatch a CONNECT_SERVICE or rather SET_SERVICE_CONNECTED
}

export default RnsOffersStore