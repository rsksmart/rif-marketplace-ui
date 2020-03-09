import React, { FC } from 'react';
import { Spinner } from 'react-bootstrap';
export interface LoadingSpinnerProps {
  message: string;
}
const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message, children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Spinner animation="border" variant="primary">
        {children}
      </Spinner>
      <span>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
