import React, { useContext, FC } from "react"
import RnsOffersStore, { RnsOffersStoreProps, RnsOffersStoreProvider } from "../OffersStore"


describe('RnsOffersStoreProvider', () => {
    describe('initial state', () => {

        test('should contain empty array "listing"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { listing } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

                expect(listing).toBe([])
                return <div></div>
            }
            <RnsOffersStoreProvider>
                <TestComponent />
            </RnsOffersStoreProvider>

        })
        test('should contain an empty object "filters"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { filters } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

                expect(filters).toBe({ status: 'owned' })
                return <div></div>
            }
            <RnsOffersStoreProvider>
                <TestComponent />
            </RnsOffersStoreProvider>

        })
        test('should not contain object "order"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { order } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

                expect(order).toBeUndefined()
                return <div></div>
            }
            <RnsOffersStoreProvider>
                <TestComponent />
            </RnsOffersStoreProvider>

        })

        test('should contain boolean "needsRefresh" set to false', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { needsRefresh } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

                expect(needsRefresh).toBe(false)
                return <div></div>
            }
            <RnsOffersStoreProvider>
                <TestComponent />
            </RnsOffersStoreProvider>
        })
    })
})
