
import { Web3Store } from '@rsksmart/rif-ui'
import { client } from 'api/rif-marketplace-cache/config'
import { ConfirmationAPI, ConfirmationsItem, mapFromTransport } from 'api/rif-marketplace-cache/confirmationsController'
import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { BlockchainAction, BLOCKCHAIN_ACTIONS } from './blockchainActions'
import blockchainReducer from './blockchainReducer'

type Modify<T, R> = Omit<T, keyof R> & R;

export interface BlockchainState {
    confirmations: Modify<Partial<ConfirmationsItem>, {
        txHash?: string,
        isConnected?: boolean
    }>
}

export interface BlockchainStoreProps {
    state: BlockchainState
    dispatch: Dispatch<BlockchainAction>
}

export const initialState: BlockchainState = {
    confirmations: {}
}

const BlockchainStore = createContext({} as BlockchainStoreProps | any)


export const BlockchainStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(blockchainReducer, initialState)
    // const [pollingTimeout, setPollingTimeout] = useState(0)
    // const [refetch, setRefetch] = useState(false)
    const { state: { apis } }: AppStoreProps = useContext(AppStore)
    const { state: { account } } = useContext(Web3Store)
    const confirmationsAPI = apis.get('confirmations') as ConfirmationAPI
    const { confirmations: { txHash, currentCt: storedCurrentCt, targetCt: storedTargetCt, isConnected } } = state

    // useEffect(() => {
    //     console.log('BlockchainStore.tsx -> pollingTimeout', pollingTimeout)
    //     if (pollingTimeout) {
    //         const pollTimeout = setTimeout(() => {
    //             console.log('refetch')
    //             // setPollingTimeout(0)
    //             setRefetch(true)
    //         }, pollingTimeout)

    //         return () => clearTimeout(pollTimeout)
    //     }
    // }, [pollingTimeout])

    useEffect(() => {
        console.log('BlockchainStore.tsx -> storedCurrentCt:', storedCurrentCt)
        console.log('BlockchainStore.tsx -> storedTargetCt:', storedTargetCt)
        if (storedCurrentCt && storedTargetCt) {
            if (storedCurrentCt >= storedTargetCt) {
                dispatch({
                    type: BLOCKCHAIN_ACTIONS.SET_TX_HASH,
                    payload: {
                        txHash: undefined
                    } as any
                })
                // setPollingTimeout(0)
            }
        }
    }, [storedCurrentCt, storedTargetCt])

    // useEffect(() => {
    //     console.log('BlockchainStore.tsx -> txHash:', txHash)
    //     console.log('BlockchainStore.tsx -> refetch:', refetch)
    //     if (txHash || refetch) {
    //         confirmationsAPI?.fetch()
    //             .then((result: Confirmations) => {
    //                 setPollingTimeout(5000)
    //                 const confirmation = result[txHash as string]
    //                 if (!confirmation) return

    //                 const { currentCt, targetCt } = confirmation
    //                 if (currentCt !== storedCurrentCt) {
    //                     dispatch({
    //                         type: BLOCKCHAIN_ACTIONS.SET_CONFIRMATIONS,
    //                         payload: {
    //                             currentCt,
    //                             targetCt
    //                         } as any
    //                     })
    //                 }
    //             })
    //     }
    // }, [txHash, refetch, storedCurrentCt, confirmationsAPI])

    useEffect(() => {
        if (isConnected && txHash) {
            confirmationsAPI.attachEvent('newConfirmation', (result) => {
                const confs = mapFromTransport([result])
                const currentTx = confs[txHash as string]
                if (currentTx) {
                    dispatch({
                        type: BLOCKCHAIN_ACTIONS.SET_CONFIRMATIONS,
                        payload: currentTx as any
                    })
                }
            })
        }
    }, [isConnected, txHash, confirmationsAPI])

    useEffect(() => {
        if (account) {
            if (confirmationsAPI) {
                const isConnected = !!confirmationsAPI.connect(client, account)
                if (isConnected) {
                    dispatch({
                        type: BLOCKCHAIN_ACTIONS.CONNECT_CONFIRMATIONS,
                        payload: { isConnected } as any
                    })
                }
            }
        }
    }, [account, confirmationsAPI])

    const value = { state, dispatch }
    return <BlockchainStore.Provider value={value}>{children}</BlockchainStore.Provider>
}

export default BlockchainStore