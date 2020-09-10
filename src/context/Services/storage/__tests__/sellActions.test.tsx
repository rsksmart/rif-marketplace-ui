import { initialState } from '../StorageSellContext'
import {
  StoragePlanItem, TimePeriodEnum,
} from '../interfaces'
import { storageSellActions } from '../storageSellReducer'
import {
  AddItemPayload, SetCountryPayload, SetAvailableSizePayload,
} from '../storageSellActions'

const mockedPlanItem: StoragePlanItem = {
  currency: 'RBTC',
  internalId: 1,
  pricePerGb: 0.001,
  timePeriod: TimePeriodEnum.Daily,
}

describe('StorageSellContext', () => {
  describe('initial state', () => {
    test('should have empty plan items', () => {
      expect(initialState.planItems).toEqual([])
    })
  })
  describe('storageSellActions', () => {
    describe('ADD_ITEM', () => {
      test('should add a planItem to the state', () => {
        const payload: AddItemPayload = mockedPlanItem
        const { planItems } = storageSellActions.ADD_ITEM(initialState, payload)
        expect(planItems).toEqual([mockedPlanItem])
      })
      test('should increment the internalCounter', () => {
        const payload: AddItemPayload = mockedPlanItem
        const { internalCounter } = storageSellActions.ADD_ITEM(initialState, payload)
        const expectedInternalCounter = initialState.internalCounter + 1
        expect(internalCounter).toEqual(expectedInternalCounter)
      })
    })
    describe('REMOVE_ITEM', () => {
      test.todo('add and remove an item')
    })
    describe('EDIT_ITEM', () => {
      test.todo('add and edit an existing item')
    })
    describe('SET_COUNTRY', () => {
      const expectedCountry = 'UY'
      const payload: SetCountryPayload = {
        country: expectedCountry,
      }
      const { country } = storageSellActions.SET_COUNTRY(initialState, payload)
      expect(country).toBe(expectedCountry)
    })
    describe('SET_AVAILABLE_SIZE', () => {
      const expectedSize = 10
      const payload: SetAvailableSizePayload = {
        availableSize: expectedSize,
      }
      const { availableSize } = storageSellActions.SET_AVAILABLE_SIZE(initialState, payload)
      expect(availableSize).toBe(expectedSize)
    })
  })
})
