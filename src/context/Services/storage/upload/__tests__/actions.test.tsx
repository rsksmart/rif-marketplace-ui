import Big from 'big.js'
import actions from '../actions'
import { initialState } from '../Context'
import {
  IsLoadingPayload, SizeLimitPayload, State, StatusPayload,
} from '../interfaces'

describe('Storage Upload Actions', () => {
  describe('SET_STATUS', () => {
    test('should return state with updated status', () => {
      const payload: StatusPayload = {
        inProgress: true,
        isDone: true,
        uploadResponse: {
          fileHash: 'MOCK_HASH',
          fileSize: 1,
          message: 'MOCK_MESSAGE',
        },
      }
      const returnedState: State = actions.SET_STATUS(initialState, payload)
      const expectedState: State = {
        ...initialState,
        status: payload,
      }

      expect(returnedState).not.toEqual(initialState)
      expect(returnedState).toEqual(expectedState)
    })
  })
  describe('SET_SIZE_LIMIT', () => {
    test('should return state with updated fileSizeLimit', () => {
      const payload: SizeLimitPayload = {
        fileSizeLimit: Big(1),
      }
      const returnedState: State = actions.SET_SIZE_LIMIT(initialState, payload)
      const expectedState: State = {
        ...initialState,
        ...payload,
      }

      expect(returnedState).not.toEqual(initialState)
      expect(returnedState).toEqual(expectedState)
    })
  })
  describe('SET_IS_LOADING', () => {
    test('should return state with updated isLoading', () => {
      const payload: IsLoadingPayload = {
        sizeLimit: true,
      }
      const returnedState: State = actions.SET_IS_LOADING(initialState, payload)
      const expectedState: State = {
        ...initialState,
        isLoading: payload,
      }

      expect(returnedState).not.toEqual(initialState)
      expect(returnedState).toEqual(expectedState)
    })
  })
})
