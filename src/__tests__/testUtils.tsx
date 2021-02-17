import React, { FC, useContext } from 'react'

const useProviderTest = <T extends object>(
  Provider: React.ElementType,
  context: React.Context<T>) => (
    { test }: { test: Function },
  ): React.ReactElement => {
    const MockConsumer: FC = () => {
      test(useContext(context))

      return <div />
    }

    return (
      <Provider>
        <MockConsumer />
      </Provider>
    )
  }

test.skip('fake test', () => {
  expect(true).toBeTruthy()
})

export default {}
export {
  useProviderTest,
}
