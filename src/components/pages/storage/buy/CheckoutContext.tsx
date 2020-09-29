import { Web3Store } from '@rsksmart/rif-ui'
import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import StorageOffersContext from 'context/Services/storage/OffersContext'
import { BillingPlan, PeriodInSeconds, StorageOffer } from 'models/marketItems/StorageItem'
import React, {
  createContext, Dispatch, FC,
  useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { convertToWeiString, parseToBigDecimal } from 'utils/parsers'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import Web3 from 'web3'

type AuxiliaryState = {
  currencyOptions: SupportedTokens[]
  currentRate: number
  endDate: string
  periodsCount: number
  planOptions: BillingPlan[]
  selectedCurrency: number
  selectedPlan: number
  totalFiat: string
}

export type Order = Pick<StorageOffer, 'id' | 'system' | 'location'> & {
  billingPeriod
  token
  total: string
}

export type PinnedContent = {
  name: string
  size: string
  unit: UNIT_PREFIX_POW2
  hash: string
}

type Agreement = Order & PinnedContent

type ContractActions = {
  createAgreement: (newAgreement: Agreement) => Promise<void>
}

type State = {
  order: Order
  auxiliary: AuxiliaryState
  pinned?: PinnedContent
  contract: ContractActions
}

type InitialisePayload = Pick<AuxiliaryState, 'currencyOptions'> & Pick<Order, 'id' | 'system' | 'location'>

export type PurchaseStorageAction = (
  | {
    type: 'CHANGE_CURRENCY'
    payload: { index: number }
  }
  | {
    type: 'SET_AUXILIARY'
    payload: Partial<AuxiliaryState>
  }
  | {
    type: 'SET_ORDER'
    payload: Partial<Order>
  }
  | {
    type: 'SET_PINNED'
    payload: Partial<PinnedContent>
  }
  | {
    type: 'INITIALISE'
    payload: InitialisePayload
  }
  | {
    type: 'SET_ACTION'
    payload: Partial<ContractActions>
  }
)

interface Actions {
  CHANGE_CURRENCY: (
    state: State,
    { index: selectedCurrency }: { index: number },
  ) => State
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>) => State
  SET_ORDER: (state: State, payload: Partial<Order>) => State
  SET_PINNED: (state: State, payload: PinnedContent) => State
  INITIALISE: (state: State, payload: InitialisePayload) => State
  SET_ACTION: (state: State, payload: Partial<ContractActions>) => State
}

const actions: Actions = {
  CHANGE_CURRENCY: (
    state: State,
    { index: selectedCurrency }: { index: number },
  ): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      selectedCurrency,
      selectedPlan: 0,
      periodsCount: 0,
    },
  }),
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      ...payload,
    },
  }),
  SET_ORDER: (state: State, payload: Partial<Order>): State => ({
    ...state,
    order: {
      ...state.order,
      ...payload,
    },
  }),
  SET_PINNED: (state: State, payload: PinnedContent): State => ({
    ...state,
    pinned: {
      ...state.pinned,
      ...payload,
    },
  }),
  INITIALISE: (state: State, {
    currencyOptions, id, location, system,
  }: InitialisePayload): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      currencyOptions,
    },
    order: {
      ...state.order,
      ...{ id, location, system },
    },
  }),
  SET_ACTION: (
    state: State,
    payload: Partial<ContractActions>,
  ): State => ({
    ...state,
    contract: {
      ...state.contract,
      ...payload,
    },
  }),
}

export type Props = {
    state: State
    dispatch: Dispatch<PurchaseStorageAction>
}

const reducer = (state: State, action: PurchaseStorageAction): State => {
  const { type, payload } = action
  const actionFunction = actions[type]

  if (actionFunction) {
    const newState: State = actionFunction(state, payload as never)

    if (state === newState) {
      Logger.getInstance().debug('Checkout Context Action', type, 'no change in state:', state)
    } else {
      Logger.getInstance().debug('Checkout Context Action', type, 'old state:', state)
      Logger.getInstance().debug('Checkout Context Action', type, 'new state:', newState)
      const diff = Object.entries(newState).filter((v, i) => state[i] !== v)
      Logger.getInstance().debug('Checkout Context Action', type, 'state diff:', diff)
    }
    return newState
  }

  Logger.getInstance().warn('Storage Checkout Context:', type, 'action is not defined!')
  return state
}

const initialState: State = {
  order: {
    id: '',
    system: '',
    location: '',
    total: '',
    billingPeriod: '',
    token: '',
  },
  auxiliary: {
    currencyOptions: [],
    currentRate: 0,
    endDate: '',
    periodsCount: 0,
    planOptions: [],
    selectedCurrency: 0,
    selectedPlan: 0,
    totalFiat: '',
  },
  contract: {
    createAgreement: (): Promise<void> => Promise.resolve(),
  },
}

const newAgreement = (web3: Web3, account: string) => async ({
  id,
  total,
  size,
  billingPeriod,
  hash,
  token,
}: Agreement): Promise<void> => {
  const storageContract = (await import('contracts/Storage')).default.getInstance(web3)
  const receipt = await storageContract.newAgreement(
    {
      amount: convertToWeiString(total),
      billingPeriod,
      fileHash: hash,
      provider: id,
      size,
      token,
    }, { from: account },
  )
  Logger.getInstance().info('Agreement created:', receipt)
}

const Context = createContext<Props>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
})

const Provider: FC = ({ children }) => {
  const history = useHistory()

  const {
    state: {
      exchangeRates: {
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)

  const {
    state: {
      order: listedOffer,
    },
  } = useContext(StorageOffersContext)
  const listedItem: StorageOffer | undefined = listedOffer?.item

  const [isInitialised, setIsInitialised] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    auxiliary: {
      selectedCurrency,
      currencyOptions,
      selectedPlan,
      planOptions,
      periodsCount,
      currentRate,
    },
    pinned,
  } = state

  // Initialise context
  useEffect(() => {
    if (!isInitialised && listedItem) {
      const {
        subscriptionOptions,
        id,
        system,
        location,
      } = listedItem
      const currencies: SupportedTokens[] = Array.from(
        new Set(subscriptionOptions.map(
          (option: BillingPlan) => option.currency,
        )),
      )

      setIsInitialised(true)
      dispatch({
        type: 'INITIALISE',
        payload: {
          currencyOptions: currencies,
          id,
          system,
          location,
        },
      })
    }
  }, [listedItem, isInitialised])

  // Prepare new agreement action
  useEffect(() => {
    console.log(': ----------------------------------------------')
    console.log('Provider:FC -> web3', web3)
    console.log('Provider:FC -> account', account)
    console.log(': ----------------------------------------------')

    if (web3 && account) {
      dispatch({
        type: 'SET_ACTION',
        payload: {
          createAgreement: newAgreement(web3, account),
        },
      })
    }
  }, [web3, account])

  // Sets currency related states
  useEffect(() => {
    if (
      isInitialised
      && currencyOptions.length
      && selectedCurrency >= 0
      && listedItem
      && pinned
    ) {
      const { subscriptionOptions } = listedItem
      const newToken = currencyOptions[selectedCurrency]
      const newRate = crypto[newToken]?.rate

      const newPlans = subscriptionOptions
        .filter((plan: BillingPlan) => plan.currency === newToken)
        .map((plan: BillingPlan) => {
          const pricePerSize = (plan.price.div(UNIT_PREFIX_POW2.MEGA).mul(pinned.size)).mul(pinned.unit)
          console.log(': ------------------------------------')
          console.log('Provider:FC -> plan.price', plan.price)
          console.log(': ------------------------------------')
          console.log(': --------------------------------------------')
          console.log('Provider:FC -> pricePerSizeMB', pricePerSize)
          console.log(': --------------------------------------------')

          return {
            ...plan,
            price: pricePerSize,
          }
        })

      dispatch({
        type: 'SET_AUXILIARY',
        payload: {
          planOptions: newPlans,
          currentRate: newRate,
        },
      })
      dispatch({
        type: 'SET_ORDER',
        payload: {
          token: newToken,
        },
      })
    }
  }, [isInitialised, currencyOptions, selectedCurrency, crypto, listedItem, pinned])

  // Recalculates total amounts and subscription end date
  useEffect(() => {
    if (isInitialised && pinned) {
      const { price, period }: BillingPlan = planOptions[selectedPlan]
      const currentTotal = price.mul(periodsCount)
      const currentTotalFiat = currentTotal.mul(currentRate)
      const currentBillingPeriod = PeriodInSeconds[period]
      const currentPeriodsInSec = currentBillingPeriod
      * periodsCount
      const dateNow = new Date(Date.now())
      const currentEndDate = new Date(
        dateNow.setSeconds(dateNow.getSeconds() + currentPeriodsInSec),
      ).toLocaleDateString()

      dispatch({
        type: 'SET_ORDER',
        payload: {
          total: currentTotal.toString(),
          billingPeriod: currentBillingPeriod,
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
    listedItem,
    currentRate,
  ])

  const value = useMemo(() => ({ state, dispatch }), [state])

  if (!listedItem) {
    history.replace(ROUTES.STORAGE.BUY.BASE)
    return null
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

function withCheckoutContext<T>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> {
  return (props: T): React.ReactElement => (
    <Provider>
      <Component {...props} />
    </Provider>
  )
}

export default withCheckoutContext
export const CheckoutContext = Context
