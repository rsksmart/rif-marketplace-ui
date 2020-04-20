import { render, cleanup } from '@testing-library/react';
import React from 'react';
import App from './App';

afterEach(cleanup)

test('renders wrapper', () => {
  const { getByTestId } = render(<App />);
  const wrapperElement = getByTestId('wrapper');
  expect(wrapperElement).toBeInTheDocument();
});
