import { initialState } from '../ListingContext'
import {
  StoragePlanItem, TimePeriodEnum,
} from '../interfaces'
import { listingActions } from '../listingReducer'
import {
  AddItemPayload, SetCountryPayload, SetAvailableSizePayload,
} from '../listingActions'

const mockedPlanItem: StoragePlanItem = {
  currency: 'RBTC',
  internalId: 1,
  pricePerGb: 0.001,
  timePeriod: TimePeriodEnum.Daily,
}

describe('StorageListingContext', () => {
  describe('initial state', () => {
    test('should have empty plan items', () => {
      expect(initialState.planItems).toEqual([])
    })
    test('available periods should be all periods', () => {
      expect(initialState.availablePeriods).toEqual(initialState.allPeriods)
    })
  })
  describe('listingActions', () => {
    describe('ADD_ITEM', () => {
      test('should add a planItem to the state', () => {
        const payload: AddItemPayload = mockedPlanItem
        const { planItems } = listingActions.ADD_ITEM(initialState, payload)
        expect(planItems).toEqual([mockedPlanItem])
      })
      test('should increment the internalCounter', () => {
        const payload: AddItemPayload = mockedPlanItem
        const { internalCounter } = listingActions.ADD_ITEM(initialState, payload)
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
      const { country } = listingActions.SET_COUNTRY(initialState, payload)
      expect(country).toBe(expectedCountry)
    })
    describe('SET_AVAILABLE_SIZE', () => {
      const expectedSize = 10
      const payload: SetAvailableSizePayload = {
        availableSize: expectedSize,
      }
      const { availableSize } = listingActions.SET_AVAILABLE_SIZE(initialState, payload)
      expect(availableSize).toBe(expectedSize)
    })
  })
})
