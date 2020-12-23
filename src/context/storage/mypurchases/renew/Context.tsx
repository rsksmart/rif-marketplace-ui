import { Web3Store } from '@rsksmart/rif-ui'
import Big from 'big.js'
import networkConfig from 'config'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import AgreementsContext, { AgreementContextProps } from 'context/Services/storage/agreements'
import createWithContext from 'context/storeUtils/createWithContext'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { UIError } from 'models/UIMessage'
import React, {
  createContext, FC, useCallback, useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { calcRenewalDate, getShortDateString } from 'utils/dateUtils'
import Logger from 'utils/Logger'
import { convertToWeiString, parseToBigDecimal } from 'utils/parsers'
import Web3 from 'web3'
import { SUPPORTED_TOKENS } from 'contracts/interfaces'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import { AgreementUpdateData } from 'context/Confirmations/interfaces'
import { reducer } from './actions'
import { AsyncActions, Props, State } from './interfaces'

export const initialState: State = {
  auxiliary: {
    currentRate: 0,
    endDate: '',
    periodsCount: 1,
    plan: {
      currency: SUPPORTED_TOKENS.rbtc,
      period: 'Daily',
      price: new Big(0),
    },
    totalFiat: '',
    currentFiat: {
      displayName: 'USD',
      symbol: 'usd',
    },
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
  const history = useHistory()

  const {
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )

  const {
    state: {
      exchangeRates: {
        crypto,
        currentFiat,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  const {
    state: {
      order: agreement,
    },
  } = useContext<AgreementContextProps>(AgreementsContext)

  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)
  const {
    dispatch: confirmationsDispatch,
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)

  const [isInitialised, setIsInitialised] = useState(false)
  const [asyncActions, setAsyncActions] = useState(initialAsyncActions)

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    auxiliary: {
      periodsCount,
      currentRate,
      plan,
    },
    order,
  } = state

  // Initialise context
  useEffect(() => {
    if (!isInitialised && agreement) {
      const billingPlan: BillingPlan = {
        currency: agreement.paymentToken,
        period: agreement.subscriptionPeriod,
        price: parseToBigDecimal(agreement.subscriptionPrice.times(agreement.size), 18),
      }

      dispatch({
        type: 'INITIALISE',
        payload: {
          ...agreement,
          plan: billingPlan,
        },
      })
      setIsInitialised(true)
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
          token: networkConfig.contractAddresses[paymentToken],
        }
        const storageContract = (await import('contracts/storage'))
          .default
          .StorageContract
          .getInstance(web3 as Web3)

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
          .depositFunds(fundsDeposit, { from: account, token: paymentToken })
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
          confirmationsDispatch({
            type: 'NEW_REQUEST',
            payload: {
              txHash: receipt.transactionHash,
              contractAction: 'AGREEMENT_RENEW',
              contractActionData: {
                agreementId: id,
              } as AgreementUpdateData,
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
  }, [web3, account, appDispatch, order, reportError, confirmationsDispatch])

  // Sets current exchange rate and fiat
  const paymentToken = order?.paymentToken
  useEffect(() => {
    if (
      isInitialised
      && crypto
      && paymentToken
    ) {
      const newRate = crypto[paymentToken]?.rate

      dispatch({
        type: 'SET_AUXILIARY',
        payload: {
          currentRate: newRate,
          currentFiat,
        },
      })
    }
  }, [isInitialised, crypto, paymentToken, currentFiat])

  // Recalculates total amounts and subscription end date
  const renewalDate = agreement?.renewalDate
  useEffect(() => {
    if (isInitialised && renewalDate) {
      const { period, price } = plan

      const currentTotal = new Big(price).mul(periodsCount)
      const currentTotalFiat = currentTotal.mul(currentRate)
      const currentEndDate = getShortDateString(
        calcRenewalDate(period, periodsCount, renewalDate),
      )

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
    periodsCount,
    currentRate,
    plan, renewalDate,
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
