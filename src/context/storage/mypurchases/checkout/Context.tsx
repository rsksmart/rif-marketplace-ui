import React, {
  createContext, FC,
  useCallback,
  useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Web3Store } from '@rsksmart/rif-ui'
import Web3 from 'web3'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { TokenAddressees } from 'context/Services/storage/interfaces'
import createWithContext from 'context/storeUtils/createWithContext'
import {
  Agreement, PeriodInSeconds,
} from 'models/marketItems/StorageItem'
import { UIError } from 'models/UIMessage'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { convertToWeiString } from 'utils/parsers'
import { reducer } from './actions'
import { AsyncActions, Props, State } from './interfaces'

export const initialState: State = {
  auxiliary: {
    currencyOptions: [],
    currentRate: 0,
    endDate: '',
    periodsCount: 1,
    planOptions: [],
    selectedCurrency: 0,
    selectedPlan: 0,
    totalFiat: '',
  },
  status: {},
}

const initialAsyncActions: AsyncActions = {
  renewAgreement: (): Promise<void> => Promise.resolve(),
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
  asyncActions: initialAsyncActions,
})

const Provider: FC = ({ children }) => {
  const { state: agreement } = useLocation<Agreement>()
  const history = useHistory()

  const {
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )

  // const {
  //   state: {
  //     exchangeRates: {
  //       crypto,
  //     },
  //   },
  // } = useContext<MarketContextProps>(MarketContext)
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)

  const [isInitialised, setIsInitialised] = useState(false)
  const [asyncActions, setAsyncActions] = useState(initialAsyncActions)

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    auxiliary: {
      selectedPlan,
      planOptions,
      periodsCount,
      currentRate,
    },
    order,
  } = state

  // Initialise context
  useEffect(() => {
    if (!isInitialised && agreement) {
      setIsInitialised(true)
      dispatch({
        type: 'INITIALISE',
        payload: {
          ...agreement,
          currencyOptions: [agreement.paymentToken],
        },
      })
    }
  }, [agreement, isInitialised])

  // Prepare async actions
  useEffect(() => {
    if (web3 && account && order) {
      const renewAgreement = async (): Promise<void> => {
        const {
          id,
          provider,
          dataReference,
          paymentToken,
          total,
        } = order

        const fundsDeposit = {
          amount: convertToWeiString(total),
          dataReference,
          provider,
          token: TokenAddressees[paymentToken],
        }
        const storageContract = (await import('contracts/storage/contract')).default.getInstance(web3 as Web3)
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: `Depositing funds to agreement ${id}...`,
          },
        })
        dispatch({
          type: 'SET_STATUS',
          payload: { inProgress: true },
        })
        const receipt = await storageContract
          .depositFunds(fundsDeposit, { from: account })
          .catch((error) => {
            reportError(new UIError({
              error,
              id: 'contract-storage',
              text: `Could not deposit funds to agreement ${id}...`,
            }))
            Logger.getInstance().error(`Error while depositing funds to agreement ${id}:`, error)
          })

        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'contract',
          },
        })

        if (receipt) {
          dispatch({
            type: 'SET_STATUS',
            payload: {
              isDone: true,
            },
          })
          Logger.getInstance().debug('Agreement receipt:', receipt)
        } else {
          dispatch({
            type: 'SET_STATUS',
            payload: {
              inProgress: false,
            },
          })
          reportError(new UIError({
            error: new Error('Did not receive the recipt from the storage contract.'),
            id: 'contract-storage',
            text: 'Could not create new agreement.',
          }))
        }
      }
      setAsyncActions({ renewAgreement })
    }
  }, [web3, account, appDispatch, order, reportError])

  // // Sets current exchange rate
  // useEffect(() => {
  //   if (
  //     isInitialised
  //     && currencyOptions.length
  //     && selectedCurrency >= 0
  //     && agreement
  //   ) {
  //     const newRate = crypto[agreement.paymentToken]?.rate

  //     dispatch({
  //       type: 'SET_AUXILIARY',
  //       payload: {
  //         currentRate: newRate,
  //       },
  //     })
  //   }
  // }, [isInitialised, crypto, agreement])

  // Recalculates total amounts and subscription end date
  useEffect(() => {
    if (isInitialised && agreement) {
      const {
        subscriptionPeriod,
        renewalDate,
        subscriptionPrice,
      } = agreement
      const currentTotal = subscriptionPrice.mul(periodsCount)
      const currentTotalFiat = currentTotal.mul(currentRate)
      const periodSec = PeriodInSeconds[subscriptionPeriod]
      const currentPeriodsInSec = periodSec * periodsCount
      const currentEndDate = new Date(
        renewalDate.setSeconds(renewalDate.getSeconds() + currentPeriodsInSec),
      ).toLocaleDateString()

      dispatch({
        type: 'SET_ORDER',
        payload: {
          total: currentTotal,
        },
      })
      dispatch({
        type: 'SET_AUXILIARY',
        payload: {
          totalFiat: currentTotalFiat.toString(),
          endDate: currentEndDate,
        },
      })
    }
  }, [
    isInitialised,
    selectedPlan,
    periodsCount,
    planOptions,
    currentRate,
  ])

  const value = useMemo(() => ({
    state,
    dispatch,
    asyncActions,
  }), [state, asyncActions])

  if (!agreement) {
    history.replace(ROUTES.STORAGE.MYPURCHASES.BASE)
    return null
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default createWithContext(Provider)
