import { initialState } from '../Context'
import {
  ConfirmationsRecord, ContractAction, NewConfirmationPayload, NewRequestPayload, State,
} from '../interfaces'
import actions from '../actions'

const MOCK_THASH = 'MOCK_HASH'
let state: State

describe('Confirmations Context Actions', () => {
  beforeEach(() => {
    state = { ...initialState }
  })
  describe('NEW_CONFIRMATION', () => {
    test('should return state with added confirmations when payload.confirmations < payload.targetConfirmation', () => {
      const expectedConfirmation = {
        currentCount: 2,
        targetCount: 20,
        contractAction: 'STAKING_STAKE' as ContractAction,
      }

      const payload: NewConfirmationPayload = {
        confirmations: expectedConfirmation.currentCount,
        event: 'MOCK_EVENT',
        targetConfirmation: expectedConfirmation.targetCount,
        transactionHash: MOCK_THASH,
      }

      state.confirmations = {
        [MOCK_THASH]: {
          ...expectedConfirmation,
          currentCount: 1,
        },
      }

      const {
        confirmations,
      }: Partial<State> = actions.NEW_CONFIRMATION(
        state, payload,
      )

      expect(confirmations[MOCK_THASH]).toBeTruthy()
      expect(confirmations[MOCK_THASH]).toEqual(expectedConfirmation)
    })

    test('should return state with no change when transaction hash is not present in state.confirmations', () => {
      const payload: NewConfirmationPayload = {
        confirmations: 4,
        event: 'MOCK_EVENT',
        targetConfirmation: 20,
        transactionHash: MOCK_THASH,
      }

      const {
        confirmations,
      }: Partial<State> = actions.NEW_CONFIRMATION(
        state, payload,
      )

      expect(confirmations).toBeTruthy()
      expect(confirmations).toEqual({})
    })

    test('should return state without given confirmation hash when payload.confirmations >= payload.targetConfirmation', () => {
      const initialConfirmations = {
        [MOCK_THASH]: {
          currentCount: 1,
          targetCount: 2,
          contractAction: 'STAKING_STAKE' as ContractAction,
        },
      }

      const payload: NewConfirmationPayload = {
        confirmations: 2,
        event: 'MOCK_EVENT',
        targetConfirmation: 2,
        transactionHash: MOCK_THASH,
      }

      state.confirmations = initialConfirmations
      expect(state.confirmations).toEqual(initialConfirmations)
      const {
        confirmations,
      }: Partial<State> = actions.NEW_CONFIRMATION(
        state, payload,
      )

      expect(confirmations).toBeTruthy()
      expect(confirmations.MOCK_EVENT).toEqual(undefined)
    })
  })

  describe('NEW_REQUEST', () => {
    test('should return state with added transaction', () => {
      const payload: NewRequestPayload = {
        txHash: MOCK_THASH,
        contractAction: 'AGREEMENT_NEW',
      }

      const expectedConfirmations: ConfirmationsRecord = {
        [MOCK_THASH]: {
          currentCount: 0,
          contractAction: 'AGREEMENT_NEW',
        },
      }

      const {
        confirmations,
      }: Partial<State> = actions.NEW_REQUEST(state, payload)

      expect(confirmations).toBeTruthy()
      expect(confirmations).toEqual(expectedConfirmations)
    })
  })
})
