
import RnsDomainsStore, { RnsDomainsStoreProvider, RnsDomainsStoreProps } from "../DomainsStore"
import React, { useContext, FC } from "react"

describe('RnsDomainsStoreProvider', () => {
    describe('initial state', () => {

        test('should contain empty array "listing"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { listing } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

                expect(listing).toBe([])
                return <div></div>
            }
            <RnsDomainsStoreProvider>
                <TestComponent />
            </RnsDomainsStoreProvider>

        })
        test('should contain an empty object "filters"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { filters } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

                expect(filters).toBe({ status: 'owned' })
                return <div></div>
            }
            <RnsDomainsStoreProvider>
                <TestComponent />
            </RnsDomainsStoreProvider>

        })
        test('should not contain object "order"', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { order } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

                expect(order).toBeUndefined()
                return <div></div>
            }
            <RnsDomainsStoreProvider>
                <TestComponent />
            </RnsDomainsStoreProvider>

        })

        test('should contain boolean "needsRefresh" set to false', () => {

            const TestComponent: FC<{}> = () => {
                const { state: { needsRefresh } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

                expect(needsRefresh).toBe(false)
                return <div></div>
            }
            <RnsDomainsStoreProvider>
                <TestComponent />
            </RnsDomainsStoreProvider>
        })
    })
})
