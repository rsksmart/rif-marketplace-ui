import React from 'react';

export default ({ text, onClick }) => (
  <div
    style={{
      padding: 5,
      margin: 5,
      borderRadius: '4px',
      textAlign: 'center',
      border: '1px solid black',
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    {text}
  </div>
);
