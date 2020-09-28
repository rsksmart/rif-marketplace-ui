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
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import Web3 from 'web3'

type AuxiliaryState = {
  planOptions: BillingPlan[]
  currencyOptions: SupportedTokens[]
  currentToken?: SupportedTokens
  currentRate: number
  selectedCurrency: number
  selectedPlan: number
  periodsCount: number
}

export type Order = Pick<StorageOffer, 'id' | 'system' | 'location'> & {
  total: string
  totalFiat: string
  endDate: string
}

type Agreement = {
    provider
    amount
    size
    billingPeriod
    hash
    token
  }

type ContractActions = {
  createAgreement: (newAgreement: Agreement) => Promise<void>
}

export type PinnedContent = {
  name: string
  size: string
  unit: UNIT_PREFIX_POW2
  hash: string
}

type State = {
  order: Order
  auxiliary: AuxiliaryState
  pinned?: PinnedContent
  contract: ContractActions
  agreement?: Agreement
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
    return actionFunction(state, payload as never)
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
    totalFiat: '',
    endDate: '',
  },
  auxiliary: {
    currencyOptions: [],
    currentRate: 0,
    planOptions: [],
    selectedCurrency: 0,
    selectedPlan: 0,
    periodsCount: 0,
  },
  contract: {
    createAgreement: (): Promise<void> => Promise.resolve(),
  },
}

const newAgreement = (web3: Web3, account: string) => async ({
  provider,
  amount,
  size,
  billingPeriod,
  hash,
  token,
}: Agreement): Promise<void> => {
  const storageContract = (await import('contracts/Storage')).default.getInstance(web3)
  console.log('agreement:', {
    provider,
    amount,
    size,
    billingPeriod,
    hash,
    token,
  })
  const receipt = await storageContract.newAgreement(
    {
      amount,
      billingPeriod,
      fileHash: hash,
      provider,
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
      periodsCount,
      currentRate,
    },
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
    ) {
      const { subscriptionOptions } = listedItem
      const newToken = currencyOptions[selectedCurrency]
      const newRate = crypto[newToken]?.rate

      const newPlans = subscriptionOptions
        .filter((plan: BillingPlan) => plan.currency === newToken)

      dispatch({
        type: 'SET_AUXILIARY',
        payload: {
          planOptions: newPlans,
          currentToken: newToken,
          currentRate: newRate,
        },
      })
    }
  }, [isInitialised, currencyOptions, selectedCurrency, crypto, listedItem])

  // Recalculates total amounts and subscription end date
  useEffect(() => {
    const currentPlan: BillingPlan
    | undefined = listedItem?.subscriptionOptions[selectedPlan]

    if (isInitialised && currentPlan) {
      const currentTotal = currentPlan.price.mul(periodsCount)
      const currentTotalFiat = currentTotal.mul(currentRate)
      const currentPeriodsInSec = PeriodInSeconds[currentPlan.period]
      * periodsCount
      const dateNow = new Date(Date.now())
      const currentEndDate = new Date(
        dateNow.setSeconds(dateNow.getSeconds() + currentPeriodsInSec),
      ).toLocaleDateString()

      dispatch({
        type: 'SET_ORDER',
        payload: {
          total: currentTotal.toString(),
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
