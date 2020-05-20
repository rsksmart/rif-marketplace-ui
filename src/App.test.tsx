import { render, cleanup } from '@testing-library/react'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

afterEach(cleanup)

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
