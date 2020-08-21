import storeReducerFactory from '../reducer'
import { ContextState } from '../interfaces'

describe('storeReducerFactory', () => {
  test('should return function that returns state', () => {
    const fakeState: ContextState = { storeID: 'app' }
    const testReducer = storeReducerFactory(fakeState, {})

    expect(testReducer).toBeDefined()
    expect(typeof testReducer).toBe('function')
    expect(testReducer(fakeState, { type: '', payload: {} })).toEqual(fakeState)
  })
})
