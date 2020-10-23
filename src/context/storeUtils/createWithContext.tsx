import React from 'react'

const createWithContext = (Provider: React.ElementType) => <T extends object>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> => (props: T): React.ReactElement => (
  <Provider>
    <Component {...props} />
  </Provider>
  )

export default createWithContext
