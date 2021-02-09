import { render } from '@testing-library/react'
import React, { FC, useContext } from 'react'
import AppContext, { AppContextProvider } from '../AppContext'

const ProviderTest: FC<{test: Function}> = ({ test }) => {
  const MockConsumer: FC = () => {
    test(useContext(AppContext))

    return <div />
  }

  return (
    <AppContextProvider>
      <MockConsumer />
    </AppContextProvider>
  )
}

describe('AppContext', () => {
  describe('AppContext.Provider', () => {
    describe('AppState', () => {
      test('initial state should contian an object apis', () => {
        const test = ({ state: { apis } }): void => {
          expect(apis).toBeTruthy()
        }

        render(<ProviderTest test={test} />)
      })
    })
  })
})
