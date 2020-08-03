import storeReducerFactory from "../reducer";
import { StoreState } from "../interfaces";

describe('storeReducerFactory', () => {

    test('should return function that returns state', () => {
        const fakeState: StoreState = { storeID: 'app' }
        const testReducer = storeReducerFactory(fakeState, {})

        expect(testReducer).toBeDefined()
        expect(typeof testReducer).toBe('function')
        expect(testReducer(fakeState, { type: '', payload: {} })).toEqual(fakeState)
    })

})
