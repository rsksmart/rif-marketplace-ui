import React, { useContext, FC } from "react"
import RnsSoldStore, { RnsSoldStoreProps, RnsSoldStoreProvider } from "../SoldStore"



describe('RnsSoldStoreProvider', () => {
    describe('initial state', () => {

        test('should contain empty array "listing"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { listing } } = useContext<RnsSoldStoreProps>(RnsSoldStore)

                expect(listing).toBe([])
                return <div></div>
            }
            <RnsSoldStoreProvider>
                <TestComponent />
            </RnsSoldStoreProvider>

        })
        test('should contain an empty object "filters"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { filters } } = useContext<RnsSoldStoreProps>(RnsSoldStore)

                expect(filters).toBe({ status: 'owned' })
                return <div></div>
            }
            <RnsSoldStoreProvider>
                <TestComponent />
            </RnsSoldStoreProvider>

        })
        test('should not contain object "order"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { order } } = useContext<RnsSoldStoreProps>(RnsSoldStore)

                expect(order).toBeUndefined()
                return <div></div>
            }
            <RnsSoldStoreProvider>
                <TestComponent />
            </RnsSoldStoreProvider>

        })

        test('should contain boolean "needsRefresh" set to false', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { needsRefresh } } = useContext<RnsSoldStoreProps>(RnsSoldStore)

                expect(needsRefresh).toBe(false)
                return <div></div>
            }
            <RnsSoldStoreProvider>
                <TestComponent />
            </RnsSoldStoreProvider>
        })
    })
})
