import { client } from 'api/rif-marketplace-cache/config'
import React, { createContext, Dispatch, useContext, useReducer, useEffect } from 'react'
import AppStore, { AppStorePropsType as AppStoreProps } from 'store/App/AppStore'
import { BlockchainAction, BLOCKCHAIN_ACTIONS } from './blockchainActions'
import blockchainReducer from './blockchainReducer'

export interface Thunk {
    (...args: string[]): Promise<void>
}

export interface BlockchainState {
    confirmations: {
        isConnected?: boolean
        currentCt: number
        totalCt: number
    },
    thunks?: Thunk[]
}

interface BlockchainStorePropsType {
    state: BlockchainState
    dispatch: Dispatch<BlockchainAction>
}

export const initialState: BlockchainState = {
    confirmations: {
        currentCt: 0,
        totalCt: 0,
    }
}

const BlockchainStore = createContext({} as BlockchainStorePropsType | any)


export const BlockchainStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(blockchainReducer, initialState)
    const { state: { apis } }: AppStoreProps = useContext(AppStore)

    useEffect(() => {
        const confirmationAPI = apis.get('confirmations')
        if (confirmationAPI) {
            const isConnected = !!confirmationAPI.connect(client)

            if (isConnected) {
                confirmationAPI.attachEvent('updated', (result) => {
                    dispatch({
                        type: BLOCKCHAIN_ACTIONS.SET_CONFIRMATIONS,
                        payload: result
                    })
                })

                dispatch({
                    type: BLOCKCHAIN_ACTIONS.CONNECT_CONFIRMATIONS,
                    payload: { isConnected } as any
                })
            }
        }

    }, [apis])

    const value = { state, dispatch }
    return <BlockchainStore.Provider value={value}>{children}</BlockchainStore.Provider>
}

export default BlockchainStore