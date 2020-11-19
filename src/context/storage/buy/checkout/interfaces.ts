import { Big } from 'big.js'
import { BillingPlan, StorageOffer, PeriodInSeconds } from 'models/marketItems/StorageItem'
import { Dispatch } from 'react'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { Status } from 'components/templates/ProgressOverlay'
import { SupportedTokens } from 'contracts/interfaces'

// STATE
export type AuxiliaryState = {
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
  billingPeriod: PeriodInSeconds
  token: SupportedTokens
  total: Big
}

export type PinnedContent = {
  size: string
  unit: UNIT_PREFIX_POW2
  hash: string
}

export type State = {
  order: Order
  auxiliary: AuxiliaryState
  pinned?: PinnedContent
  status: Status
}

// PAYLOAD
export type InitialisePayload = Pick<AuxiliaryState, 'currencyOptions'> & Pick<Order, 'id' | 'system' | 'location'>
export type StatusPayload = (
  | {
    inProgress: boolean
    isDone?: never
  } | {
    inProgress?: never
    isDone: true
  }
)

// ACTIONS
export type Action = (
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
    type: 'SET_STATUS'
    payload: StatusPayload
  }
)

export type Actions = {
  CHANGE_CURRENCY: (
    state: State,
    { index: selectedCurrency }: { index: number },
  ) => State
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>) => State
  SET_ORDER: (state: State, payload: Partial<Order>) => State
  SET_PINNED: (state: State, payload: PinnedContent) => State
  INITIALISE: (state: State, payload: InitialisePayload) => State
  SET_STATUS: (state: State, payload: StatusPayload) => State
}

export type AsyncAction = {
  (args?: unknown): Promise<void>
}

export type AsyncActions = {
  createAgreement: AsyncAction
}

// PROPS
export type Props = {
    state: State
    dispatch: Dispatch<Action>
    asyncActions: AsyncActions
}
